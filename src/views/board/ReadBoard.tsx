import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
// import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Button } from '@mui/material';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import ListSharpIcon from '@mui/icons-material/ListSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Board } from './ListBoard';
// import useAuth from 'hooks/useAuth';

// ==============================|| SAMPLE PAGE ||============================== //

const ReadeBoardPage = () => {
    // const theme = useTheme();
    const [board, setBoard] = useState<Board>({});
    // const { user } = useAuth();
    const { boardId } = useParams();
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        const getBoard = await fetch(`http://localhost:8080/board/${boardId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await getBoard.json();
        if (results.status === 200) {
            setBoard({ id: results.data.id, title: results.data.title, text: results.data.text });
        } else if (results.status !== 200) {
            console.log('실패');
        }
    }, [boardId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDelete = async () => {
        const deleteBoard = await fetch(`http://localhost:8080/board/${boardId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await deleteBoard.json();
        if (results.status === 200) {
            console.log('성공');
            navigate('/boards');
        } else if (results.status !== 200) {
            console.log('실패');
        }
    };

    return (
        <MainCard
            title={board.title}
            secondary={
                <Grid container spacing={2}>
                    <Grid item>
                        <Button color="primary" variant="contained" onClick={() => navigate('/board', { state: board })}>
                            <EditSharpIcon fontSize="small" sx={{ mr: 0.75 }} />
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button color="primary" variant="contained" onClick={handleDelete}>
                            <DeleteSharpIcon fontSize="small" sx={{ mr: 0.75 }} />
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button color="primary" variant="contained" onClick={() => navigate('/boards')}>
                            <ListSharpIcon fontSize="small" sx={{ mr: 0.75 }} />
                        </Button>
                    </Grid>
                </Grid>
            }
        >
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Stack spacing={gridSpacing}>
                        <div dangerouslySetInnerHTML={{ __html: board.text! }} />
                    </Stack>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ReadeBoardPage;
