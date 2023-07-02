// import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack } from '@mui/material';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import ReactQuillDemo from '../form/plugins/Wysiwug/ReactQuill';
// import { useEffect } from 'react';

// ==============================|| SAMPLE PAGE ||============================== //

const SamplePage = () => {
    const theme = useTheme();

    // const navigate = useNavigate();

    // useEffect(() => navigate('fdfdfd'), []);
    return (
        <MainCard
            title="게시글 작성"
            secondary={
                <Button color="secondary" variant="contained" onClick={(event) => console.log(event)}>
                    <SaveTwoToneIcon fontSize="small" sx={{ mr: 0.75 }} />
                    저장
                </Button>
            }
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Stack
                        spacing={gridSpacing}
                        sx={{
                            '& .quill': {
                                bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50',
                                borderRadius: '12px',
                                '& .ql-toolbar': {
                                    bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                                    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : 'primary.light',
                                    borderTopLeftRadius: '12px',
                                    borderTopRightRadius: '12px'
                                },
                                '& .ql-container': {
                                    borderColor:
                                        theme.palette.mode === 'dark' ? `${theme.palette.dark.light + 20} !important` : 'primary.light',
                                    borderBottomLeftRadius: '12px',
                                    borderBottomRightRadius: '12px',
                                    '& .ql-editor': {
                                        minHeight: 135
                                    }
                                }
                            }
                        }}
                    >
                        <ReactQuillDemo />
                        <Button variant="contained" color="primary">
                            저장
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            {/* <Typography variant="body2">
                Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif
                ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in
                reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa
                qui officiate descent molls anim id est labours.
            </Typography> */}
        </MainCard>
    );
};

export default SamplePage;
