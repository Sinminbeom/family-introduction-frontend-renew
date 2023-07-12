import { useState } from 'react';
import { Avatar, Input, Button, Grid, Paper } from '@mui/material';
// import { Formik } from 'formik';

const SingleComment = ({ boardId, comment }: { boardId: any; comment: any }) => {
    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState('');

    // const CallBack = (response: any) => {
    //     if (!response[0].Status) {
    //         setCommentValue(''); // 저장후 빈칸으로 만들기 위해
    //         // props.refreshFunction(response);
    //     } else {
    //         alert(response[0].Message);
    //     }
    // };

    const onSubmit = async (event: any) => {
        event.preventDefault();

        const formData = new FormData();

        const userSessionStorage = sessionStorage.getItem('user');
        if (userSessionStorage) {
            const userJson = JSON.parse(userSessionStorage);
            formData.append('boardId', boardId);
            formData.append('text', CommentValue);
            formData.append('parentId', comment.id);
            formData.append('userId', userJson.id);
        }
        
        // if (id === undefined || id === null) {
        //     const createBoard = await fetch('http://localhost:8080/boards', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({  boardId, text: CommentValue, parentId: comment.id, createUserId: user?.id, updateUserId: user?.id })
        //     });
        //     const results = await createBoard.json();
        //     if (results.status === 200) {
        //         console.log('성공');
        //         navigate(`/board/${results.data.id}`);
        //     } else if (results.status !== 200) {
        //         console.log('실패');
        //     }
        // } else {
        //     const updateBoard = await fetch(`http://localhost:8080/boards/${id}`, {
        //         method: 'PUT',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({  boardId, text: CommentValue, parentId: comment.id, createUserId: user?.id, updateUserId: user?.id })
        //     });
        //     const results = await updateBoard.json();
        //     if (results.status === 200) {
        //         console.log('성공');
        //     } else if (results.status !== 200) {
        //         console.log('실패');
        //     }
        // }

    };

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply);
    };

    const onHandleChange = (event: any) => {
        setCommentValue(event.currentTarget.value);
    };

    const onKeyDownReplyOpen = (event: any) => {
        // setCommentValue(event.currentTarget.value);
        console.log('fdfd');
    };

    return (
        <div>
            <Paper style={{ padding: '20px 20px' }}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar alt="Remy Sharp" />
                    </Grid>
                    <Grid justifyContent="left" item xs zeroMinWidth>
                        <h4 style={{ margin: 0, textAlign: 'left' }}>{comment.text}</h4>
                        <p style={{ textAlign: 'left' }}>{comment.text}</p>
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={onClickReplyOpen}
                            onKeyDown={onKeyDownReplyOpen}
                            key="comment-basic-reply-to"
                        >
                            답글 달기
                        </div>
                    </Grid>
                </Grid>
            </Paper>
            {OpenReply && ( // openReply값이 true일때만 대댓글창을 보이게만듬
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <Input
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="내용을 작성해 주세요"
                    />
                    <br />
                    <Button style={{ width: '30%', height: '52px' }} onClick={onSubmit}>
                        등록
                    </Button>
                </form>
            )}
        </div>
    );
};

export default SingleComment;
