import React from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Menu, MenuItem, Pagination, Typography } from '@mui/material'; // InputAdornment OutlinedInput

// project imports
import UserList from './ListBoard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
// import { IconSearch } from '@tabler/icons';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';

// ==============================|| USER LIST STYLE 1 ||============================== //

const ListStylePage1 = () => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState<Element | ((element: Element) => Element) | null | undefined>(null);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">List</Typography>
                    </Grid>
                    <Grid item>
                        <Button color="secondary" variant="contained" onClick={() => navigate('/board')}>
                            <AssignmentTwoToneIcon fontSize="small" sx={{ mr: 0.75 }} />
                            글쓰기
                        </Button>
                    </Grid>
                </Grid>
            }
            content={false}
        >
            <UserList />
            <Grid item xs={12} sx={{ p: 3 }}>
                <Grid container justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Pagination count={10} color="primary" />
                    </Grid>
                    <Grid item>
                        <Button
                            size="large"
                            sx={{ color: theme.palette.grey[900] }}
                            color="secondary"
                            endIcon={<ExpandMoreRoundedIcon />}
                            onClick={handleClick}
                        >
                            10 Rows
                        </Button>
                        <Menu
                            id="menu-user-list-style1"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            variant="selectedMenu"
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                        >
                            <MenuItem onClick={handleClose}> 10 Rows</MenuItem>
                            <MenuItem onClick={handleClose}> 20 Rows</MenuItem>
                            <MenuItem onClick={handleClose}> 30 Rows </MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ListStylePage1;
