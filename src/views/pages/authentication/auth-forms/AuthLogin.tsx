import React, { useContext } from 'react';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    // Checkbox,
    // Divider,
    FormControl,
    // FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput
    // Stack,
    // Typography
    // useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
// import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// import Google from 'assets/images/icons/social-google.svg';
// import { DefaultRootStateProps } from 'types';
import { LOGIN } from 'store/actions';
import UserContext from 'contexts/UserContext';

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = (props: { loginProp?: number }, { ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    // const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    // const customization = useSelector((state: DefaultRootStateProps) => state.customization);
    // const [checked, setChecked] = React.useState(true);
    const user = useContext(UserContext);

    // const { firebaseEmailPasswordSignIn, firebaseGoogleSignIn } = useAuth();
    // const googleHandler = async () => {
    //     try {
    //         await firebaseGoogleSignIn();
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.SyntheticEvent) => {
        event.preventDefault();
    };

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                {/* <Grid item xs={12}>
                    <AnimateButton>
                        <Button
                            disableElevation
                            fullWidth
                            onClick={googleHandler}
                            size="large"
                            variant="outlined"
                            sx={{
                                color: 'grey.700',
                                backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : theme.palette.grey[100]
                            }}
                        >
                            <Box sx={{ mr: { xs: 1, sm: 2, width: 20 } }}>
                                <img src={Google} alt="google" width={16} height={16} style={{ marginRight: matchDownSM ? 8 : 16 }} />
                            </Box>
                            Sign in with Google
                        </Button>
                    </AnimateButton>
                </Grid> */}
                {/* <Grid item xs={12}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex'
                        }}
                    >
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                        <Button
                            variant="outlined"
                            sx={{
                                cursor: 'unset',
                                m: 2,
                                py: 0.5,
                                px: 7,
                                borderColor:
                                    theme.palette.mode === 'dark'
                                        ? `${theme.palette.dark.light + 20} !important`
                                        : `${theme.palette.grey[100]} !important`,
                                color: `${theme.palette.grey[900]}!important`,
                                fontWeight: 500,
                                borderRadius: `${customization.borderRadius}px`
                            }}
                            disableRipple
                            disabled
                        >
                            OR
                        </Button>

                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                </Grid> */}
                {/* <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">로그인</Typography>
                    </Box>
                </Grid> */}
            </Grid>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('이메일형식에 맞지 않습니다').max(255).required('이메일은 필수입니다.'),
                    password: Yup.string().max(255).required('비밀번호는 필수입니다.')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        // await firebaseEmailPasswordSignIn(values.email, values.password).then(
                        //     () => {
                        //         // WARNING: do not set any formik state here as formik might be already destroyed here. You may get following error by doing so.
                        //         // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
                        //         // To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
                        //         // github issue: https://github.com/formium/formik/issues/2430
                        //     },
                        //     (err: any) => {
                        //         if (scriptedRef.current) {
                        //             setStatus({ success: false });
                        //             setErrors({ submit: err.message });
                        //             setSubmitting(false);
                        //         }
                        //     }
                        // );
                        await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: values.email, password: values.password })
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
                                                    name: result.data.name || 'Betty',
                                                    avatar: result.data.avatar
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
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Email Address"
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
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
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        {/* <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label="Remember me"
                            />
                            <Typography
                                variant="subtitle1"
                                component={Link}
                                to={props.loginProp ? `/pages/forgot-password/forgot-password${props.loginProp}` : '/forgot'}
                                color="secondary"
                                sx={{ textDecoration: 'none' }}
                            >
                                Forgot Password?
                            </Typography>
                        </Stack> */}
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
                                    로그인
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default FirebaseLogin;
