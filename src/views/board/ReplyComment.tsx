import React, { useEffect, useState } from 'react';
import SingleComment from './SingleComment';

const ReplyComment = ({ boardId, commentList, parentCommentId }: { boardId: any; commentList: any; parentCommentId: any }) => {
    const [ChildCommentNumber, setChildCommentNumber] = useState(0);
    const [OpenReplyComments, setOpenReplyComments] = useState(false);

    useEffect(() => {
        let commentNumber = 0;
        commentList.forEach((comment: any) => {
            if (comment.parentId === parentCommentId) {
                commentNumber += 1;
            }
        });
        setChildCommentNumber(commentNumber);
    }, [commentList]);

    const renderReplyComment = (_parentCommentId: any) =>
        commentList.map((comment: any, index: number) => (
            <React.Fragment key={index}>
                {comment.parentId === _parentCommentId && (
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment
                            // refreshFunction={props.refreshFunction}
                            comment={comment}
                            boardId={boardId}
                        />
                        <ReplyComment
                            // refreshFunction={props.refreshFunction}
                            commentList={commentList}
                            boardId={boardId}
                            parentCommentId={comment.id}
                        />
                    </div>
                )}
            </React.Fragment>
        ));

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments);
    };

    const onHandleKeyDown = () => {
        console.log('fdfd');
    };

    return (
        <div>
            {ChildCommentNumber > 0 && !OpenReplyComments && (
                <div
                    role="button"
                    tabIndex={0}
                    style={{ fontSize: '14px', margin: '0', color: 'gray', position: 'relative', left: '90px' }}
                    onClick={onHandleChange}
                    onKeyDown={onHandleKeyDown}
                >
                    답글 {ChildCommentNumber}개 보기
                </div>
            )}
            {OpenReplyComments && renderReplyComment(parentCommentId)}
            {/* 대댓글을 달때 눌리며 나오고 아니면숨긴상태 */}
        </div>
    );
};

export default ReplyComment;
