import { useState } from 'react';
import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

// material-ui
// import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack } from '@mui/material';
import SaveTwoToneIcon from '@mui/icons-material/SaveTwoTone';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
// import useAuth from 'hooks/useAuth';

// ==============================|| SAMPLE PAGE ||============================== //

const ReadeBoardPage = () => {
    // const theme = useTheme();
    const [text, setText] = useState('');
    // const { user } = useAuth();
    const { boardId } = useParams();
    // const navigate = useNavigate();

    // useEffect(() => navigate('fdfdfd'), []);

    const handleClick = async () => {
        const getBoard = await fetch(`http://localhost:8080/boards/${boardId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await getBoard.json();
        if (results.status === 200) {
            console.log(results.data.text);
            setText(results.data.text);
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
                    <Stack spacing={gridSpacing}>
                        <div dangerouslySetInnerHTML={{ __html: text }} />
                    </Stack>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ReadeBoardPage;
