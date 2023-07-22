import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Avatar,
    // Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    // TextField,
    Typography
    // useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
// import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
// import Google from 'assets/images/icons/social-google.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import UserContext from 'contexts/UserContext';
import { LOGIN } from 'store/actions';
import { StringColorProps } from 'types'; // DefaultRootStateProps

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
// import Loader from 'ui-component/Loader';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const FirebaseRegister = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    // const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    // const customization = useSelector((state: DefaultRootStateProps) => state.customization);
    const [showPassword, setShowPassword] = React.useState(false);
    const [checked, setChecked] = React.useState(true);

    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState<StringColorProps>();
    const user = useContext(UserContext);
    // const [isLoading, setLoading] = React.useState(false);
    // const { firebaseRegister, firebaseGoogleSignIn } = useAuth();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.SyntheticEvent) => {
        event.preventDefault();
    };

    const changePassword = (value: string) => {
        const temp = strengthIndicator(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    // useEffect(() => setLoading(false), []);

    // if (isLoading !== undefined && isLoading) {
    //     return <Loader />;
    // }

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Sign up with Email address</Typography>
                    </Box>
                </Grid>
            </Grid>

            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    password: '',
                    avatar: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    name: Yup.string().max(255).required('Name is required'),
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required'),
                    avatar: Yup.string().max(255).required('avatar is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        await fetch(`${process.env.REACT_APP_API_URL}/register`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: values.email,
                                name: values.name,
                                password: values.password,
                                avatar: values.avatar
                            })
                        })
                            .then((res) => res.json())
                            .then((result) => {
                                if (result) {
                                    if (result.status === 200) {
                                        user?.dispatch({
                                            type: LOGIN,
                                            payload: {
                                                isLoggedIn: true,
                                                user: {
                                                    id: result.data.id,
                                                    email: result.data.email!,
                                                    name: result.data.name || 'Betty'
                                                }
                                            }
                                        });
                                        sessionStorage.setItem('user', JSON.stringify(result.data));
                                    } else if (result.status !== 200) {
                                        if (scriptedRef.current) {
                                            setStatus({ success: false });
                                            setErrors({ submit: result.message });
                                            setSubmitting(false);
                                        }
                                    }
                                }
                            });
                    } catch (err: any) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.avatar && errors.avatar)} sx={{ ...theme.typography.customInput }}>
                            <Grid container justifyContent="center" alignItems="center" spacing={1}>
                                <Grid item>
                                    <Avatar alt="User" src={values.avatar} sx={{ width: 64, height: 64 }} />
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" component="label" size="small" startIcon={<UploadTwoToneIcon />}>
                                        Upload
                                        <input
                                            accept="image/*"
                                            multiple
                                            type="file"
                                            name="avatar"
                                            onChange={async (e) => {
                                                if (!e.target.files) {
                                                    return;
                                                }
                                                // setLoading(true);
                                                const file = e.target.files[0];
                                                const formData = new FormData();
                                                formData.append('uploadFile', file);
                                                const options = {
                                                    method: 'POST',
                                                    body: formData
                                                };
                                                try {
                                                    const response = await fetch(`${process.env.REACT_APP_API_URL}/upload`, options);
                                                    const results = await response.json();
                                                    if (results.status === 200) {
                                                        const src = results.data;
                                                        setFieldValue('avatar', src);
                                                    } else if (results.status !== 200) {
                                                        console.error('err', results.message);
                                                    }
                                                } catch (err) {
                                                    console.error('err', err);
                                                }
                                                // setLoading(false);
                                            }}
                                            hidden
                                        />
                                    </Button>
                                </Grid>
                                <Grid item>
                                    {touched.avatar && errors.avatar && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.avatar}
                                        </FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                        </FormControl>
                        <FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-name-register">Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-name-register"
                                type="name"
                                value={values.name}
                                name="name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.name && errors.name && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.name}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Email Address / Username</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
                                    changePassword(e.target.value);
                                }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {strength !== 0 && (
                            <FormControl fullWidth>
                                <Box sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Box
                                                style={{ backgroundColor: level?.color }}
                                                sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="subtitle1" fontSize="0.75rem">
                                                {level?.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FormControl>
                        )}

                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked}
                                            onChange={(event) => setChecked(event.target.checked)}
                                            name="checked"
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="subtitle1">
                                            Agree with &nbsp;
                                            <Typography variant="subtitle1" component={Link} to="#">
                                                Terms & Condition.
                                            </Typography>
                                        </Typography>
                                    }
                                />
                            </Grid>
                        </Grid>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Sign up
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseRegister;
