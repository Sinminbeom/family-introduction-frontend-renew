import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
// import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Button } from '@mui/material';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
// import useAuth from 'hooks/useAuth';

// ==============================|| SAMPLE PAGE ||============================== //

const ReadeBoardPage = () => {
    // const theme = useTheme();
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    // const { user } = useAuth();
    const { boardId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const getBoard = await fetch(`http://localhost:8080/boards/${boardId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const results = await getBoard.json();
            if (results.status === 200) {
                setText(results.data.text);
                setTitle(results.data.title);
            } else if (results.status !== 200) {
                console.log('실패');
            }
        };
        fetchData();
    }, [boardId]);

    return (
        <MainCard
            title={title}
            secondary={
                <Button color="secondary" variant="contained" onClick={() => navigate(`/board/${boardId}`)}>
                    <SaveTwoToneIcon fontSize="small" sx={{ mr: 0.75 }} />
                    수정
                </Button>
            }
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Stack spacing={gridSpacing}>
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                    </Stack>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ReadeBoardPage;
