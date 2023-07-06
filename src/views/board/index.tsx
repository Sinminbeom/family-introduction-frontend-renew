import React from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
// import { useTheme } from '@mui/material/styles';
import { Button, Grid, Typography, TablePagination, TableContainer, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'; // InputAdornment OutlinedInput

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Avatar from 'ui-component/extended/Avatar';

// assets
// import { IconSearch } from '@tabler/icons';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';

// ==============================|| USER LIST STYLE 1 ||============================== //
export interface Board {
    id?: number;
    title?: string;
    text?: string;
    status?: string;
    createUserName?: string;
    userEmail?: string;
}

const ListStylePage1 = () => {
    // const theme = useTheme();
    const [data, setData] = React.useState<Board[]>([]);
    const navigate = useNavigate();

    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);

    const fetchData = async () => {
        const response = await fetch('http://localhost:8080/boards', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await response.json();
        setData(results.data);
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        event?.target.value && setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">List</Typography>
                    </Grid>
                    <Grid item>
                        <Button color="primary" variant="contained" onClick={() => navigate('/board')}>
                            <AssignmentTwoToneIcon fontSize="small" sx={{ mr: 0.75 }} />
                        </Button>
                    </Grid>
                </Grid>
            }
            content={false}
        >
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
                            data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
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
                                                    {row.userEmail}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </MainCard>
    );
};

export default ListStylePage1;
