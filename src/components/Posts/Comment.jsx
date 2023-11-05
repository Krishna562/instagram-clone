import defaultProfilePic from "../../assets/default profile pic.jpg";
import axios from "../../axios/axios";
import { useSelector, useDispatch } from "react-redux";
import { setErr } from "../../store/reducers/Error/errReducer";
import {
  setAllUserPosts,
  setCurrentUser,
} from "../../store/reducers/User/userReducer";
import { setAllPosts } from "../../store/reducers/Post/postReducer";
import { useEffect, useState } from "react";

const Comment = ({ commentObj, postId }) => {
  const [commentCreator, setCommentCreator] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { comment, _id, userId } = commentObj;
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const allUserPosts = useSelector((state) => state.user.allUserPosts);
  const allPosts = useSelector((state) => state.post.allPosts);

  const getLatestCurrentUser = async () => {
    try {
      const result = await axios.get("/loggedIn");
      const user = result.data.user;
      dispatch(setCurrentUser(user));
    } catch (err) {
      console.log(err);
      dispatch(setErr(err.response.data));
    }
  };

  const getSpecificUser = async () => {
    try {
      const result = await axios.get(`/specific-user/${userId}`);
      const user = result.data.specificUser;
      setCommentCreator(user);
    } catch (err) {
      console.log(err);
      dispatch(setErr(err.response.data));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLatestCurrentUser();
    getSpecificUser();
  }, []);

  const deleteComment = async () => {
    try {
      const result = await axios.patch("/delete-comment", {
        postId: postId,
        commentId: _id,
      });
      const updatedPost = result.data.updatedPost;
      const updatedArr = allUserPosts.map((userPost) =>
        userPost._id === updatedPost._id ? updatedPost : userPost
      );
      const updatedPosts = allPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      dispatch(setAllPosts(updatedPosts));
      dispatch(setAllUserPosts(updatedArr));
    } catch (err) {
      dispatch(setErr(err.response.data));
    }
  };

  if (!isLoading) {
    const { profilePic, username } = commentCreator;
    return (
      <div className="comment">
        <img
          src={profilePic ? profilePic : defaultProfilePic}
          alt="profile pic"
        />
        <div>
          <div className="comment__info">
            <p className="comment__info-creator">{username}</p>
            <p className="comment__info-comment">{comment}</p>
          </div>
          {currentUser._id === userId && (
            <button
              className="comment__delete-btn"
              onClick={() => {
                deleteComment();
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default Comment;
