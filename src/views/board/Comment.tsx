import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
import { PostServiceComponent } from '../service/ServiceComponent';
import { Button, Input } from '@mui/material';

const Comment = (props: any) => {
    const videoId = props.postId;
    const [CommentValue, setCommentValue] = useState('');
    // const user = useSelector((state) => state.user);

    const handleChange = (event) => {
        setCommentValue(event.currentTarget.value);
    };


    const CallBack = (result) => {
        if(!result[0].Status){
            setCommentValue(''); //저장후 빈칸으로 만들기 위해
        }
        else{
            alert(result.Message);
        }
    }
  
  const onsubmit = (event: any) => {
    event.preventDefault();

    const formData = new FormData();

    if (!CommentValue) {
        return alert('댓글 내용을 입력해주세요.');
    }

    const userSessionStorage = sessionStorage.getItem('user');
    if (userSessionStorage) {
        const userJson = JSON.parse(userSessionStorage);
        formData.append('BoardSeq',props.postSeq);
        formData.append('BoardCommentContent',CommentValue);
        formData.append('userSeq', userJson.id);
    }

    PostServiceComponent('http://49.168.71.214:8000/CommentSave.php',formData,CallBack);
};

  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />

      {/* Comment Lists */}
      {props.commentList &&
        props.commentList.map(
          (comment, index) =>
            !comment.UpCommentSeq && ( //대댓글은 우선 숨기겠다는 의미
              <React.Fragment>
                <SingleComment
                  refreshFunction={props.refreshFunction}
                  comment={comment}
                  postSeq={props.postSeq}
                  key={index}
                />
                <ReplyComment
                  refreshFunction={props.refreshFunction}
                  commentList={props.commentList}
                  parentCommentId={comment.BoardCommentSeq}
                  postSeq={props.postSeq}
                  key={index}
                />
              </React.Fragment>
              
            )
        )}
      {/* Root Comment Form */}

      <form style={{ display: 'flex' }} onSubmit={onsubmit}>
        <Input
          style={{ width: '100%', borderRadius: '5px' }}
          onChange={handleChange}
          value={CommentValue}
          placeholder="내용을 작성해 주세요"
        />
        <br />
        <Button style={{ width: '30%', height: '52px' }} onClick={onsubmit}>
          등록
        </Button>
      </form>
    </div>
  );
}

export default Comment;