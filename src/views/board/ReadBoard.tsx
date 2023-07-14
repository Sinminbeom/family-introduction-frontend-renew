import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, FormProvider, useForm } from 'react-hook-form';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Button, Collapse, FormHelperText, TextField, useMediaQuery } from '@mui/material'; // Typography
import EditSharpIcon from '@mui/icons-material/EditSharp';
import ListSharpIcon from '@mui/icons-material/ListSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
// import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';

// third-party
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
// import { gridSpacing } from 'store/constant';
import { Board } from './ListBoard';
import Comment from './Comment';
import Avatar from 'ui-component/extended/Avatar';
// import useAuth from 'hooks/useAuth';
import { FormInputProps } from 'types';
// import { Reply } from '_mockApis/user-profile/types';

// const avatarImage = require.context('assets/images/profile', true);

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

// ==============================|| SAMPLE PAGE ||============================== //
export interface CommentType {
    id?: number;
    parentId?: number;
    boardId?: number;
    text?: string;
}

const post = {
    id: '#1POST_JONE_DOE',
    profile: {
        id: '#52JONE_DOE',
        avatar: 'user-1.png',
        name: 'John Doe',
        time: '15 min ago'
    },
    data: {
        content:
            'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. There are many variations of passages.',
        comments: [
            {
                id: '#3COMMENT_JONE_DOE',
                profile: {
                    id: '#52JONE_DOE',
                    avatar: 'user-3.png',
                    name: 'Barney Thea',
                    time: '8 min ago '
                },
                data: {
                    comment: 'It is a long established fact that a reader will be distracted by the readable content of a page.',
                    likes: {
                        like: true,
                        value: 55
                    }
                }
            },
            {
                id: '#2COMMENT_JONE_DOE',
                profile: {
                    id: '#52JONE_DOE',
                    avatar: 'user-4.png',
                    name: 'Maddison Wilber',
                    time: '5 min ago '
                },
                data: {
                    comment:
                        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.There are many variations of passages.',
                    likes: {
                        like: false,
                        value: 68
                    },
                    replies: [
                        {
                            id: '#1REPLY_JONE_DOE',
                            profile: {
                                id: '#52JONE_DOE',
                                avatar: 'user-5.png',
                                name: 'John Doe',
                                time: 'just now '
                            },
                            data: {
                                comment: 'It is a long established fact that a reader will be distracted by the readable content.',
                                likes: {
                                    like: true,
                                    value: 10
                                }
                            }
                        }
                    ]
                }
            }
        ]
    }
};

const ReadeBoardPage = () => {
    const theme = useTheme();
    const [board, setBoard] = useState<Board>({});
    // const [comments, setComments] = useState<CommentType[]>([]);
    // const { user } = useAuth();
    const { boardId } = useParams();
    const navigate = useNavigate();
    const matchesXS = useMediaQuery(theme.breakpoints.down('md'));
    const { data, profile } = post;
    const [openComment, setOpenComment] = useState(!(data.comments && data.comments.length > 0));

    const getBoardData = useCallback(async () => {
        const getBoard = await fetch(`http://localhost:8080/boards/${boardId}`, {
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
        // const getComments = await fetch(`http://localhost:8080/boards/${boardId}/comments`, {
        //     method: 'GET',
        //     headers: { 'Content-Type': 'application/json' }
        // });
        // const results = await getComments.json();
        // if (results.status === 200) {
        //     // setComments(results.data);
        // } else if (results.status !== 200) {
        //     console.log('실패');
        // }
    }, [boardId]);

    useEffect(() => {
        getBoardData();
        getCommentsData();
    }, [getBoardData, getCommentsData]);

    const handleDelete = async () => {
        const deleteBoard = await fetch(`http://localhost:8080/boards/${boardId}`, {
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

    let commentsResult:
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>[] = <></>;

    if (data && data.comments) {
        commentsResult = data.comments.map((comment, index) => (
            <Comment
                boardId={boardId!}
                comment={comment}
                key={comment.id}
                user={profile}
                // replyAdd={replyAdd}
                // handleCommentLikes={handleCommentLikes}
                // handleReplayLikes={handleReplayLikes}
            />
        ));
    }
    const handleChangeComment = () => {
        setOpenComment((prev) => !prev);
    };

    const methods = useForm({
        resolver: yupResolver(validationSchema)
    });
    const { errors } = methods;

    // const replyAdd = async (postId: string, commentId: string, reply: Reply) => {};
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
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <div dangerouslySetInnerHTML={{ __html: board.text! }} />
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
                                    {data.comments ? data.comments.length : 0} comments
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
                {/* add new comment */}
                <Collapse in={openComment} sx={{ width: '100%' }}>
                    <Grid item xs={12} sx={{ pt: 2 }}>
                        <form onSubmit={() => console.log('fdfd')}>
                            <Grid container spacing={2} alignItems="flex-start">
                                <Grid item sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    <Avatar
                                        sx={{ mt: 0.75 }}
                                        alt="User 1"
                                        // TODO: 회원가입시 이미지 넣으면 추가
                                        // src={profile.avatar && avatarImage(`./${profile.avatar}`).default}
                                        size="xs"
                                    />
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
