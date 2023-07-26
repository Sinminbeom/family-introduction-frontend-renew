import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import ReactHtmlParser from 'react-html-parser';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Button, Collapse, FormHelperText, TextField, useMediaQuery, Menu, MenuItem, ButtonBase } from '@mui/material'; // Typography
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import MoreVertTwoToneIcon from '@mui/icons-material/MoreVertTwoTone';

// third-party
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import Comment from './Comment';
import Avatar from 'ui-component/extended/Avatar';
import useAuth from 'hooks/useAuth';
import { FormInputProps } from 'types';
import { CommentData, Post, Reply } from '_mockApis/user-profile/types';

export interface Board {
    id?: number;
    title?: string;
    text?: string;
    status?: string;
    createUserName?: string;
    email?: string;
    image?: string;
}

const validationSchema = yup.object().shape({
    name: yup.string().required('Comment Field is Required')
});

// ==============================|| COMMENT TEXTFIELD ||============================== //

const FormInput = ({ bug, label, size, fullWidth = true, name, required, ...others }: FormInputProps) => {
    let isError = false;
    let errorMessage = '';
    if (bug && Object.prototype.hasOwnProperty.call(bug, name)) {
        isError = true;
        errorMessage = bug[name].message;
    }

    return (
        <>
            <Controller
                as={TextField}
                name={name}
                defaultValue=""
                label={label}
                size={size}
                fullWidth={fullWidth}
                InputLabelProps={{
                    className: required ? 'required-label' : '',
                    required: required || false
                }}
                error={isError}
                {...others}
            />
            {errorMessage && (
                <Grid item xs={12}>
                    <FormHelperText error>{errorMessage}</FormHelperText>
                </Grid>
            )}
        </>
    );
};

// ==============================|| ReadBoard PAGE ||============================== //

const ReadeBoardPage = () => {
    const theme = useTheme();
    const [board, setBoard] = useState<Board>({});
    const [comments, setComments] = useState<Post>();
    const { user } = useAuth();
    const { boardId } = useParams();
    const navigate = useNavigate();
    const matchesXS = useMediaQuery(theme.breakpoints.down('md'));
    const [openComment, setOpenComment] = useState(!(comments?.data.comments && comments?.data.comments.length > 0));
    const [anchorEl, setAnchorEl] = useState<Element | ((element: Element) => Element) | null | undefined>(null);

    const getBoardData = useCallback(async () => {
        const getBoard = await fetch(`${process.env.REACT_APP_API_URL}/boards/${boardId}`, {
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

    const getCommentsData = useCallback(async () => {
        const getComments = await fetch(`${process.env.REACT_APP_API_URL}/boards/${boardId}/comments`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await getComments.json();
        if (results.status === 200) {
            setComments({
                id: boardId,
                profile: {
                    id: '2',
                    name: 'minbeom',
                    avatar: 'https://drive.google.com/uc?export=view&id=1h26qRYBpNyccAZc6jzMujy436Wl_XfPD',
                    time: '8 min ago'
                },
                data: {
                    comments: results.data,
                    images: [],
                    content: '',
                    likes: {
                        like: true,
                        value: 0
                    }
                }
            });
        } else if (results.status !== 200) {
            console.log('실패');
        }
    }, [boardId]);

    useEffect(() => {
        getBoardData();
        getCommentsData();
    }, [getBoardData, getCommentsData]);

    const handleDelete = async () => {
        const deleteBoard = await fetch(`${process.env.REACT_APP_API_URL}/boards/${boardId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await deleteBoard.json();
        if (results.status === 200) {
            navigate('/boards');
        } else if (results.status !== 200) {
            console.log('실패');
        }
    };

    const replyAdd = async (_boardId: string, commentId: string, reply: any) => {
        // reply: Reply
        const saveComment = await fetch(`${process.env.REACT_APP_API_URL}/boards/${_boardId}/comments/${commentId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reply)
        });
        const results = await saveComment.json();
        if (results.status === 200) {
            setComments((prev: any) => ({
                ...prev,
                data: {
                    ...prev.data,
                    comments: prev.data.comments.map((comment: any) =>
                        comment.id === results.data.parentId
                            ? {
                                  ...comment,
                                  data: {
                                      ...comment.data,
                                      replies: [...comment.data.replies, results.data]
                                  }
                              }
                            : {
                                  ...comment
                              }
                    )
                }
            }));
        } else if (results.status !== 200) {
            console.log('실패');
        }
    };

    const handleCommentDelete = async (commentId: string) => {
        const deleteComment = await fetch(`${process.env.REACT_APP_API_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await deleteComment.json();
        if (results.status === 200) {
            setComments((prev: any) => ({
                ...prev,
                data: {
                    ...prev.data,
                    comments: prev.data.comments.filter((comment: any) => comment.id !== commentId)
                }
            }));
        } else if (results.status !== 200) {
            console.log('실패');
        }
    };

    const handleReplyDelete = async (commentId: string) => {
        const deleteComment = await fetch(`${process.env.REACT_APP_API_URL}/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await deleteComment.json();
        if (results.status === 200) {
            setComments((prev: any) => ({
                ...prev,
                data: {
                    ...prev.data,
                    comments: prev.data.comments.map((comment: any) => ({
                        ...comment,
                        data: {
                            ...comment.data,
                            replies: comment.data.replies.filter((reply: any) => reply.id !== commentId)
                        }
                    }))
                }
            }));
        } else if (results.status !== 200) {
            console.log('실패');
        }
    };

    let commentsResult:
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>[] = <></>;

    if (comments?.data && comments?.data.comments) {
        commentsResult = comments?.data.comments.map((comment: any, index: number) => (
            <Comment
                boardId={boardId!}
                comment={comment}
                key={comment.id}
                user={comment.profile}
                replyAdd={replyAdd}
                handleCommentDelete={handleCommentDelete}
                handleReplyDelete={handleReplyDelete}
                // handleCommentLikes={handleCommentLikes}
                // handleReplayLikes={handleReplayLikes}
            />
        ));
    }
    const handleChangeComment = () => {
        setOpenComment((prev) => !prev);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClick = (event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    };
    const onSubmit = async (comment: CommentData) => {
        handleChangeComment();

        const newComment: Reply = {
            id: 'test',
            profile: {
                id: user!.id!,
                name: user!.name!,
                avatar: user!.avatar!,
                time: 'now'
            },
            data: {
                comment: comment.name,
                replies: []
            }
        };
        const saveComment = await fetch(`${process.env.REACT_APP_API_URL}/boards/${boardId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newComment)
        });
        const results = await saveComment.json();
        if (results.status === 200) {
            setComments((prev: any) => {
                console.log(prev);
                return { ...prev, data: { ...prev?.data, comments: [...prev?.data?.comments?.concat(results?.data)!] } };
            });
            console.log(comments);
        } else if (results.status !== 200) {
            console.log('실패');
        }
        reset({ name: '' });
    };

    const methods = useForm({
        resolver: yupResolver(validationSchema)
    });

    const { handleSubmit, errors, reset } = methods;

    return (
        <MainCard
            title={board.title}
            secondary={
                <Grid container spacing={1}>
                    <Grid item>
                        <ButtonBase sx={{ borderRadius: '12px' }}>
                            <Avatar
                                variant="rounded"
                                sx={{
                                    ...theme.typography.commonAvatar,
                                    background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
                                    color: theme.palette.mode === 'dark' ? theme.palette.dark.light : theme.palette.secondary.dark,
                                    zIndex: 1,
                                    transition: 'all .2s ease-in-out',
                                    '&[aria-controls="menu-list-grow"],&:hover': {
                                        background: theme.palette.secondary.main,
                                        color: theme.palette.secondary.light
                                    }
                                }}
                                aria-controls="menu-comment"
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <MoreVertTwoToneIcon fontSize="inherit" />
                            </Avatar>
                        </ButtonBase>
                        <Menu
                            id="menu-comment"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            variant="selectedMenu"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right'
                            }}
                        >
                            <MenuItem onClick={() => navigate('/board', { state: board })}>Edit</MenuItem>
                            <MenuItem onClick={handleDelete}>Delete</MenuItem>
                            <MenuItem onClick={() => navigate('/boards')}>List</MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
            }
        >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    {ReactHtmlParser(board.text!)}
                </Grid>
                <Grid item xs={12}>
                    <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                        sx={{ mt: 0, color: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.800' }}
                    >
                        <Grid item>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    onClick={handleChangeComment}
                                    size="small"
                                    variant="text"
                                    color="inherit"
                                    startIcon={<ChatBubbleTwoToneIcon color="secondary" />}
                                >
                                    {comments?.data.comments ? comments?.data.comments.length : 0} comments
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                {/* add new comment */}
                <Collapse in={openComment} sx={{ width: '100%' }}>
                    <Grid item xs={12} sx={{ pt: 2 }}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2} alignItems="flex-start">
                                <Grid item sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    <Avatar sx={{ mt: 0.75 }} alt="User" src={user?.avatar} size="xs" />
                                </Grid>
                                <Grid item xs zeroMinWidth>
                                    <FormProvider {...methods}>
                                        <FormInput
                                            fullWidth
                                            name="name"
                                            label="Write a comment..."
                                            size={matchesXS ? 'small' : 'medium'}
                                            bug={errors}
                                        />
                                    </FormProvider>
                                </Grid>
                                <Grid item>
                                    <AnimateButton>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                            size={matchesXS ? 'small' : 'large'}
                                            sx={{ mt: 0.5 }}
                                        >
                                            Comment
                                        </Button>
                                    </AnimateButton>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Collapse>
                {commentsResult}
            </Grid>
        </MainCard>
    );
};

export default ReadeBoardPage;
