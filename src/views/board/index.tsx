import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack } from '@mui/material';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';

// third party
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import useAuth from 'hooks/useAuth';

// ==============================|| SAMPLE PAGE ||============================== //

const BoardPage = () => {
    const theme = useTheme();
    const [text, setText] = useState('');
    const { user } = useAuth();
    // const navigate = useNavigate();

    // useEffect(() => navigate('fdfdfd'), []);

    const handleTextChange = (value: string) => {
        setText(value);
    };

    const handleClick = async () => {
        const createBoard = await fetch('http://localhost:8080/boards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, createUserId: user?.id, updateUserId: user?.id })
        });
        const results = await createBoard.json();
        if (results.status === 200) {
            console.log('성공');
        } else if (results.status !== 200) {
            console.log('실패');
        }
    };

    return (
        <MainCard
            title="게시글 작성"
            secondary={
                <Button color="secondary" variant="contained" onClick={handleClick}>
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
                        <ReactQuill value={text} onChange={handleTextChange} />
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

export default BoardPage;
