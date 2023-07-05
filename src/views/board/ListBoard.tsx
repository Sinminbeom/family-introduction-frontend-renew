import React from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
// import { useTheme } from '@mui/material/styles';
import {
    // Chip,
    Grid,
    // IconButton,
    // Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    // Tooltip,
    Typography
} from '@mui/material';

// project imports
import Avatar from 'ui-component/extended/Avatar';
// import axios from 'utils/axios';
// import { UserProfile } from '_mockApis/user-profile/types';

// assets
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
// import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';

// const avatarImage = require.context('assets/images/profile', true);

// ==============================|| USER LIST 1 ||============================== //

export interface Board {
    id?: number;
    title?: string;
    text?: string;
    status?: string;
    createUserName?: string;
}

const UserList = () => {
    // const theme = useTheme();

    const [data, setData] = React.useState<Board[]>([]);
    const navigate = useNavigate();

    const getData = async () => {
        const response = await fetch('http://localhost:8080/boards', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await response.json();
        setData(results.data);
    };

    React.useEffect(() => {
        getData();
    }, []);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }}>#</TableCell>
                        <TableCell>제목</TableCell>
                        <TableCell>작성자</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data &&
                        data.map((row, index) => (
                            <TableRow hover key={index} onClick={() => navigate(`/board/${row.id}`)}>
                                <TableCell sx={{ pl: 3 }}>{row.id}</TableCell>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            {/* src={avatarImage(`./${row.avatar}`).default} */}
                                            <Avatar alt="User 1" />
                                        </Grid>
                                        <Grid item xs zeroMinWidth>
                                            <Typography align="left" variant="subtitle1" component="div">
                                                {row.createUserName}{' '}
                                                {/* {row.status === 'Active' && (
                                                    <CheckCircleIcon sx={{ color: 'success.dark', width: 14, height: 14 }} />
                                                )} */}
                                            </Typography>
                                            <Typography align="left" variant="subtitle2" noWrap>
                                                {row.title}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserList;
