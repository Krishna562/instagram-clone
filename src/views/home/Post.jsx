import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import defaultProfilePic from "../../assets/default profile pic.jpg";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import axios from "../../axios/axios";
import {
  setCurrentUser,
  setSpecificUser,
} from "../../store/reducers/User/userReducer";
import { setAllPosts } from "../../store/reducers/Post/postReducer";
import { setErr } from "../../store/reducers/Error/errReducer";
import PostModal from "../../components/Posts/PostModal";
import HoverProfile from "./HoverProfile";
import { useNavigate } from "react-router-dom";
import Tag from "../../components/Posts/Tag";

const Post = ({ post }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const allPosts = useSelector((state) => state.post.allPosts);

  const [commentInputVal, setCommentInputVal] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [areTagsVisible, setAreTagsVisible] = useState(false);

  const { creatorId, postImg, likes, comments, caption, createdAt, tags } =
    post;

  const { username, profilePic, _id } = creatorId;

  const commentRef = useRef();
  const postImgRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isCurrentUserFollowing =
    currentUser.following.find((followingId) => followingId === _id) ||
    _id === currentUser._id
      ? true
      : false;

  let timeElapsedFromCreation;

  const createdAtDate = new Date(createdAt).getTime();
  const currentTime = new Date().getTime();

  const timeInBetween = currentTime - createdAtDate;

  const timeInSeconds = Math.floor(timeInBetween / 1000);
  const timeInMinutes = Math.floor(timeInSeconds / 60);
  const timeInHours = Math.floor(timeInMinutes / 60);
  const timeInDays = Math.floor(timeInHours / 24);
  const timeInYears = Math.floor(timeInDays / 365);

  if (timeInSeconds < 60) {
    timeElapsedFromCreation = `${timeInSeconds}s`;
  } else if (timeInMinutes < 60) {
    timeElapsedFromCreation = `${timeInMinutes}m`;
  } else if (timeInHours < 24) {
    timeElapsedFromCreation = `${timeInHours}h`;
  } else if (timeInDays < 365) {
    timeElapsedFromCreation = `${timeInDays}d`;
  } else {
    timeElapsedFromCreation = `${timeInYears}y`;
  }

  const likePost = async () => {
    try {
      const result = await axios.patch("/like-post", {
        postId: post._id,
        userId: currentUser._id,
      });
      const updatedPost = result.data.likedPost;
      const updatedPosts = allPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      dispatch(setAllPosts(updatedPosts));
    } catch (err) {
      console.log(err);
      dispatch(setErr(err.response.data));
    }
  };

  const addComment = async (comment) => {
    try {
      const result = await axios.patch("/add-comment", {
        userId: currentUser._id,
        postId: post._id,
        comment: comment,
      });
      const updatedPost = result.data.updatedPost;
      const updatedPosts = allPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      dispatch(setAllPosts(updatedPosts));
    } catch (err) {
      console.log(err);
      dispatch(setErr(err.response.data));
    }
  };

  const followUser = async () => {
    try {
      const result = await axios.patch("/follow-user", {
        currentUserId: currentUser._id,
        userToFollowId: _id,
      });
      const updatedUser = result.data.updatedUser;
      dispatch(setCurrentUser(updatedUser));
    } catch (err) {
      console.log(err);
      dispatch(setErr(err.response.data));
    }
  };

  useEffect(() => {
    const hideTags = (e) => {
      if (!postImgRef.current.contains(e.target)) {
        setAreTagsVisible(false);
      }
    };

    document.addEventListener("click", hideTags);

    return () => document.removeEventListener("click", hideTags);
  }, []);

  return (
    <div className="home__post">
      {/* POST MODAL */}

      <PostModal
        post={post}
        isPostModalOpen={isPostModalOpen}
        setIsPostModalOpen={setIsPostModalOpen}
      />

      {/* HEADER */}

      <div className="home__header">
        <HoverProfile
          creator={creatorId}
          isHovering={isHovering}
          setIsHovering={setIsHovering}
        />

        <img
          src={profilePic || defaultProfilePic}
          alt="profile pic"
          className="home__header-profilePic"
          onMouseOver={() => {
            setIsHovering(true);
          }}
          onMouseLeave={() => {
            setIsHovering(false);
          }}
          onClick={() => {
            navigate(`/${username}`);
          }}
        />
        <p
          onMouseOver={() => {
            setIsHovering(true);
          }}
          onMouseLeave={() => {
            setIsHovering(false);
          }}
          onClick={() => {
            navigate(`/${username}`);
          }}
        >
          {username}
        </p>
        <span className="home__header-separator">.</span>
        <span className="home__header-time">{timeElapsedFromCreation}</span>
        {!isCurrentUserFollowing && (
          <>
            <span className="home__header-separator">.</span>
            <button
              className="home__header-followBtn"
              onClick={() => {
                followUser();
              }}
            >
              Follow
            </button>
          </>
        )}
      </div>

      {/* POST IMAGE */}

      <div className={`home__postImg ${tags.length ? "pointer" : null}`}>
        <img
          ref={postImgRef}
          src={postImg}
          alt="post image"
          onClick={() => {
            if (!tags.length) return;
            setAreTagsVisible(!areTagsVisible);
          }}
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

      {/* LIKE AND COMMENT BUTTONS */}

      <div className="home__reactionFunctions">
        {likes.find((userId) => userId === currentUser._id) ? (
          <AiFillHeart
            className="home__reactionFunctions-function liked"
            onClick={() => {
              likePost();
            }}
          />
        ) : (
          <AiOutlineHeart
            className="home__reactionFunctions-function"
            onClick={() => {
              likePost();
            }}
          />
        )}

        <FaRegComment
          className="home__reactionFunctions-function"
          onClick={() => {
            commentRef.current.focus();
          }}
        />
      </div>
      {likes.length ? (
        <div className="home__likesCount">
          {likes.length} {likes.length === 1 ? "like" : "likes"}
        </div>
      ) : (
        <div className="home__likesCount">
          Be the first one to like this post
        </div>
      )}
      <div className="home__caption">
        <span className="home__caption-username">{username}</span>
        <span className="home__caption-text">{caption}</span>
      </div>

      {/* VIEW COMMENTS BUTTON */}

      {comments.length ? (
        <button
          className="home__viewComments-btn"
          onClick={() => {
            dispatch(setSpecificUser(creatorId));
            setIsPostModalOpen(true);
          }}
        >
          View {comments.length}{" "}
          {comments.length === 1 ? "comment" : "comments"}
        </button>
      ) : null}

      {/* COMMENT FORM */}

      <form className="home__commentForm" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Add a comment..."
          ref={commentRef}
          value={commentInputVal}
          onChange={(e) => {
            setCommentInputVal(e.target.value);
          }}
        />
        <button
          onClick={() => {
            if (!commentInputVal) return;
            addComment(commentInputVal);
            setCommentInputVal("");
          }}
          style={{
            color: commentInputVal ? "dodgerblue" : "var(--LIGHT-TEXT-COLOR)",
          }}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default Post;
