import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Button, Avatar, Popover, List, Comment } from "antd";
import {
  RetweetOutlined,
  HeartOutlined,
  HeartTwoTone,
  MessageOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import PostImages from "./PostImages";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import {
  LIKE_POST_REQUEST,
  REMOVE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  RETWEET_REQUEST,
} from "../reducers/post";
import FollowButton from "./FollowButton";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { removePostLoading } = useSelector((state) => state.post);
  const [commentFormOpened, setCommentFormOpened] = useState(false);

  const id = useSelector((state) => state.user?.me?.id);
  const liked = post.Likers.some((v) => v.id === id);

  const onLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }

    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onUnLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }

    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onToggleComment = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }

    return setCommentFormOpened((prev) => !prev);
  }, [id]);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }

    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }

    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images?.[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked ? (
            <HeartTwoTone
              key="heart"
              twoToneColor="#eb2f96"
              onClick={onUnLike}
            />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User?.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button
                      type="danger"
                      onClick={onRemovePost}
                      loading={removePostLoading}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗 하셨습니다.` : null
        }
        extra={id && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images?.[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <Card.Meta
              avatar={<Avatar>{post.Retweet.User?.nickname[0]}</Avatar>}
              title={post.Retweet.User?.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
          </Card>
        ) : (
          <Card.Meta
            avatar={<Avatar>{post.User?.nickname[0]}</Avatar>}
            title={post.User?.nickname}
            description={<PostCardContent postData={post.content} />}
          />
        )}
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments?.length ?? 0}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
      {/* <Comments /> */}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
