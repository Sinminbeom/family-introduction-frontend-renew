import { useState } from 'react';
import SingleComment from '../board/SingleComment';
import ReplyComment from '../board/ReplyComment';
import { Button, Input } from '@mui/material';

const Comment = ({ boardId, commentList, refreshFunction }: { boardId: any; commentList: any; refreshFunction: any }) => {
    // const videoId = props.postId;
    const [CommentValue, setCommentValue] = useState('');

    const handleChange = (event: any) => {
        setCommentValue(event.currentTarget.value);
    };

    const onSubmit = (event: any) => {
        event.preventDefault();

        const formData = new FormData();

        // 리덕스로 변경
        const userSessionStorage = sessionStorage.getItem('user');
        if (userSessionStorage) {
            const userJson = JSON.parse(userSessionStorage);
            formData.append('boardId', boardId);
            formData.append('test', CommentValue);
            formData.append('userId', userJson.id);
        }

        // PostServiceComponent('http://49.168.71.214:8000/CommentSave.php',formData,CallBack);
    };

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/* Comment Lists */}
            {commentList &&
                commentList.map(
                    (comment: any, index: any) =>
                        !comment.parentId && ( // 대댓글은 우선 숨기겠다는 의미
                            <>
                                <SingleComment
                                    // refreshFunction={refreshFunction}
                                    comment={comment}
                                    boardId={boardId}
                                    key={index}
                                />
                                <ReplyComment
                                    // refreshFunction={refreshFunction}
                                    commentList={commentList}
                                    parentCommentId={comment.id}
                                    boardId={boardId}
                                    key={index}
                                />
                            </>
                        )
                )}
            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <Input
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleChange}
                    value={CommentValue}
                    placeholder="내용을 작성해 주세요"
                />
                <br />
                <Button style={{ width: '30%', height: '52px' }} onClick={onSubmit}>
                    등록
                </Button>
            </form>
        </div>
    );
};

export default Comment;
