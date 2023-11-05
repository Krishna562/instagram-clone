import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect, useState } from "react";
import { AiOutlineHeart, AiOutlineClose, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { SlOptions } from "react-icons/sl";
import defaultProfilePic from "../../assets/default profile pic.jpg";
import { setErr } from "../../store/reducers/Error/errReducer";
import axios from "../../axios/axios";
import { setAllUserPosts } from "../../store/reducers/User/userReducer";
import { setAllPosts } from "../../store/reducers/Post/postReducer";
import Comment from "./Comment";
import OptionsModal from "./OptionsModal";
import Tag from "./Tag";

const PostModal = ({ post, isPostModalOpen, setIsPostModalOpen, creator }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const allUserPosts = useSelector((state) => state.user.allUserPosts);
  const allPosts = useSelector((state) => state.post.allPosts);
  const _specificUser = useSelector((state) => state.user.specificUser);

  const specificUser = creator || _specificUser;

  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [commentVal, setCommentVal] = useState("");
  const [areTagsVisible, setAreTagsVisible] = useState(false);

  const dispatch = useDispatch();
  const postModalRef = useRef();
  const commentRef = useRef();
  const postImgRef = useRef();

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
      setAreTagsVisible(false);
    }
  }, [isPostModalOpen]);

  useEffect(() => {
    const hideTags = (e) => {
      if (!postImgRef.current.contains(e.target)) {
        setAreTagsVisible(false);
      }
    };
    document.addEventListener("click", hideTags);
    return () => document.removeEventListener("click", hideTags);
  }, []);

  const { postImg, comments, likes, _id, caption, tags } = post;

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
      const updatedPosts = allPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      dispatch(setAllUserPosts(updatedUserPosts));
      dispatch(setAllPosts(updatedPosts));
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
      const updatedPosts = allPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      dispatch(setAllPosts(updatedPosts));
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
      {isOptionsModalOpen && (
        <OptionsModal
          isOptionsModalOpen={isOptionsModalOpen}
          setIsOptionsModalOpen={setIsOptionsModalOpen}
          currentPostId={_id}
        />
      )}

      <div className="postModal__con">
        {/* LEFT SIDE - POST IMAGE */}

        <div className="postModal__postImg-con">
          <div className="postModal__postImg">
            <img
              src={postImg}
              alt="post image"
              style={{
                cursor: tags.length ? "pointer" : "auto",
              }}
              onClick={() => {
                setAreTagsVisible(!areTagsVisible);
              }}
              ref={postImgRef}
            />
            {areTagsVisible &&
              tags.map((tag) => {
                const { username, position } = tag;
                return (
                  <Tag
                    key={username}
                    username={username}
                    position={position}
                    areTagsVisible={areTagsVisible}
                    setAreTagsVisible={setAreTagsVisible}
                  />
                );
              })}
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="postModal__postInfo">
          {/* HEADER */}

          <div className="postModal__userInfo">
            <div className="postModal__userInfo-left">
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

            {currentUser._id === specificUser._id && (
              <SlOptions
                className="postModal__optionsBtn"
                onClick={() => {
                  setIsOptionsModalOpen(true);
                }}
              />
            )}
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

          {/* COMMENT FORM */}

          <form
            className="postModal__commentBox"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Add a comment..."
              ref={commentRef}
              onChange={(e) => {
                setCommentVal(e.target.value);
              }}
              value={commentVal}
            />
            <button
              onClick={() => {
                if (!commentVal) return;
                addComment(commentRef.current.value);
                setCommentVal("");
              }}
              style={{
                color: commentVal ? "dodgerblue" : "var(--LIGHT-TEXT-COLOR)",
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
