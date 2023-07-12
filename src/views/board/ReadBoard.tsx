import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Controller, FormProvider, useForm } from 'react-hook-form';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Button, Typography, Collapse, FormHelperText, TextField, useMediaQuery } from '@mui/material';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import ListSharpIcon from '@mui/icons-material/ListSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import ThumbUpAltTwoToneIcon from '@mui/icons-material/ThumbUpAltTwoTone';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';

// third-party
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { Board } from './ListBoard';
// import Comment from '../test/Comment';
import Comment from './Comment';
import Avatar from 'ui-component/extended/Avatar';
// import useAuth from 'hooks/useAuth';
import { FormInputProps } from 'types';

const avatarImage = require.context('assets/images/profile', true);

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

const ReadeBoardPage = () => {
    const theme = useTheme();
    const [board, setBoard] = useState<Board>({});
    const [comments, setComments] = useState<CommentType[]>([]);
    // const { user } = useAuth();
    const { boardId } = useParams();
    const navigate = useNavigate();
    const matchesXS = useMediaQuery(theme.breakpoints.down('md'));

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
        const getComments = await fetch(`http://localhost:8080/boards/${boardId}/comments`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const results = await getComments.json();
        if (results.status === 200) {
            setComments(results.data);
        } else if (results.status !== 200) {
            console.log('실패');
        }
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

    const refreshFunction = (newComment: any) => {
        // 부모의 Comments state값을 업데이트하기위한 함수
        setComments((_comments) => _comments.concat(newComment));
        // this.setState({ comments: this.state.Comments.concat(newComment)}); //자식들한테 값을 전달받아 Comments값 업데이트
    };

    let commentsResult:
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>[] = <></>;

    if (data && data.comments) {
        commentsResult = data.comments.map((comment, index) => (
            <Comment
                postId={id}
                comment={comment}
                key={comment.id}
                user={profile}
                replyAdd={replyAdd}
                handleCommentLikes={handleCommentLikes}
                handleReplayLikes={handleReplayLikes}
            />
        ));
    }

    const methods = useForm({
        resolver: yupResolver(validationSchema)
    });

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
                        <Comment boardId={boardId} commentList={comments} refreshFunction={refreshFunction} />
                    </Stack>
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
                                    variant="text"
                                    // onClick={() => handlePostLikes(id)}
                                    color="inherit"
                                    size="small"
                                    startIcon={
                                        <ThumbUpAltTwoToneIcon color={data && data.likes && data.likes.like ? 'primary' : 'inherit'} />
                                    }
                                >
                                    {data && data.likes && data.likes.value ? data.likes.value : 0}
                                    <Typography color="inherit" sx={{ fontWeight: 500, ml: 0.5, display: { xs: 'none', sm: 'block' } }}>
                                        likes
                                    </Typography>
                                </Button>
                                <Button
                                    // onClick={handleChangeComment}
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2} alignItems="flex-start">
                                <Grid item sx={{ display: { xs: 'none', sm: 'block' } }}>
                                    <Avatar
                                        sx={{ mt: 0.75 }}
                                        alt="User 1"
                                        src={profile.avatar && avatarImage(`./${profile.avatar}`).default}
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
