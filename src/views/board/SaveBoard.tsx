import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; // useNavigate

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, TextField } from '@mui/material';
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
    const [id, setId] = useState<number>();
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const { user } = useAuth();
    const { state }: { state: any } = useLocation();
    // const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        const getBoard = await fetch(`http://localhost:8080/boards/${state.id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await getBoard.json();
        if (results.status === 200) {
            setId(results.data.id);
            setText(results.data.text);
            setTitle(results.data.title);
        } else if (results.status !== 200) {
            console.log('실패');
        }
    }, [state]);

    useEffect(() => {
        if (state !== null) {
            fetchData();
        }
    }, [state, fetchData]);

    const handleTextChange = (value: string) => {
        setText(value);
    };

    const handleClick = async () => {
        if (id === undefined || id === null) {
            const createBoard = await fetch('http://localhost:8080/boards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, text, createUserId: user?.id, updateUserId: user?.id })
            });
            const results = await createBoard.json();
            if (results.status === 200) {
                console.log('성공');
            } else if (results.status !== 200) {
                console.log('실패');
            }
        } else {
            const updateBoard = await fetch('http://localhost:8080/boards', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, text, createUserId: user?.id, updateUserId: user?.id })
            });
            const results = await updateBoard.json();
            if (results.status === 200) {
                console.log('성공');
            } else if (results.status !== 200) {
                console.log('실패');
            }
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
                        <TextField id="outlined-required" label="title" value={title} onChange={(event) => setTitle(event.target.value)} />
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
