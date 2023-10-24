import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect, useState } from "react";
import { AiOutlineHeart, AiOutlineClose, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import defaultProfilePic from "../../assets/default profile pic.jpg";
import { setErr } from "../../store/reducers/Error/errReducer";
import axios from "../../axios/axios";
import { setAllUserPosts } from "../../store/reducers/User/userReducer";
import Comment from "./Comment";

const PostModal = ({ post, isPostModalOpen, setIsPostModalOpen }) => {
  const specificUser = useSelector((state) => state.user.specificUser);
  const currentUser = useSelector((state) => state.user.currentUser);
  const allUserPosts = useSelector((state) => state.user.allUserPosts);

  const dispatch = useDispatch();
  const postModalRef = useRef();
  const commentRef = useRef();

  const scrollYValue = window.scrollY;
  const scrollXValue = window.scrollX;
  const scrollToPrevVal = () => {
    window.scrollTo(scrollXValue, scrollYValue);
  };

  useEffect(() => {
    if (isPostModalOpen) {
      window.onscroll = scrollToPrevVal;
      postModalRef.current.showModal();
    } else {
      window.onscroll = function () {};
      postModalRef.current.close();
    }
  }, [isPostModalOpen]);

  const { postImg, comments, likes, _id, caption } = post;

  // LIKE POST

  const likePost = async () => {
    try {
      const result = await axios.patch("/like-post", {
        postId: _id,
        userId: currentUser._id,
      });
      const updatedPost = result.data.likedPost;
      const updatedUserPosts = allUserPosts.map((userPost) =>
        userPost._id === updatedPost._id ? updatedPost : userPost
      );
      dispatch(setAllUserPosts(updatedUserPosts));
    } catch (err) {
      dispatch(setErr(err.response.data));
    }
  };

  const addComment = async (comment) => {
    try {
      const result = await axios.patch("/add-comment", {
        userId: currentUser._id,
        postId: _id,
        comment: comment,
      });
      const updatedPost = result.data.updatedPost;
      const updatedUserPosts = allUserPosts.map((userPost) =>
        userPost._id === updatedPost._id ? updatedPost : userPost
      );
      dispatch(setAllUserPosts(updatedUserPosts));
    } catch (err) {
      dispatch(setErr(err.response.data));
    }
  };

  return (
    <dialog className="postModal" ref={postModalRef}>
      <AiOutlineClose
        className="postModal__close-btn"
        onClick={() => {
          setIsPostModalOpen(false);
        }}
      />
      <div className="postModal__con">
        <img src={postImg} alt="post image" />
        <div className="postModal__postInfo">
          <div className="postModal__userInfo">
            <img
              src={
                specificUser.profilePic
                  ? specificUser.profilePic
                  : defaultProfilePic
              }
              alt="profile pic"
            />
            <h4>{specificUser.username}</h4>
          </div>

          <div className="postModal__caption">
            <img
              src={
                specificUser.profilePic
                  ? specificUser.profilePic
                  : defaultProfilePic
              }
              alt="profile pic"
            />
            <div className="comment__info">
              <p className="comment__info-creator">{specificUser.username}</p>
              <p className="comment__info-comment">{caption}</p>
            </div>
          </div>
          <div className="postModal__comments">
            {comments.map((comment) => {
              return (
                <Comment commentObj={comment} key={comment._id} postId={_id} />
              );
            })}
          </div>
          <div className="postModal__reactionFunctions">
            {likes.find((userId) => userId === currentUser._id) ? (
              <AiFillHeart
                className="postModel__reactionFunctions-function liked"
                onClick={() => {
                  likePost();
                }}
              />
            ) : (
              <AiOutlineHeart
                className="postModel__reactionFunctions-function"
                onClick={() => {
                  likePost();
                }}
              />
            )}

            <FaRegComment
              className="postModel__reactionFunctions-function"
              onClick={() => {
                commentRef.current.focus();
              }}
            />
          </div>
          {likes.length ? (
            <div className="postModal__likes">
              {likes.length} {likes.length === 1 ? "like" : "likes"}
            </div>
          ) : (
            <div className="postModal__likes">
              Be the first one to like this
            </div>
          )}
          <form
            className="postModal__commentBox"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Add a comment..."
              ref={commentRef}
            />
            <button
              onClick={() => {
                addComment(commentRef.current.value);
                commentRef.current.value = "";
              }}
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default PostModal;
