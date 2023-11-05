import { useDispatch, useSelector } from "react-redux";
import defaultProfilePic from "../../assets/default profile pic.jpg";
import { setCurrentUser } from "../../store/reducers/User/userReducer";
import { setErr } from "../../store/reducers/Error/errReducer";
import axios from "../../axios/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HoverPost from "./HoverPost";

const HoverProfile = ({ creator, isHovering, setIsHovering }) => {
  const { username, profilePic, followers, following, _id, posts } = creator;

  const [thisUserPosts, setThisUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const getThisUserPosts = async () => {
    try {
      const result = await axios.get(`/specificUser/${username}`);
      const userPosts = result.data.userPosts;
      setThisUserPosts(userPosts);
    } catch (err) {
      console.log(err);
      dispatch(setErr(err.response.data));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getThisUserPosts();
  }, []);

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);

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

  if (!isLoading) {
    return (
      <div
        className="hoverProfile"
        style={{
          display: isHovering ? "flex" : "none",
          opacity: isHovering ? 1 : 0,
        }}
        onMouseOver={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      >
        <div className="hoverProfile__userInfo">
          <img
            src={profilePic || defaultProfilePic}
            alt="profile pic"
            onClick={() => {
              navigate(`/${username}`);
            }}
          />
          <span
            className="hoverProfile__username"
            onClick={() => {
              navigate(`/${username}`);
            }}
          >
            {username}
          </span>
        </div>
        <div className="hoverProfile__userActivity">
          <span className="hoverProfile__activity-value">
            <span className="hoverProfile__activityNum">
              {thisUserPosts.length}
            </span>{" "}
            {thisUserPosts.length === 1 ? "post" : "postss"}
          </span>
          <span className="hoverProfile__activity-value">
            <span className="hoverProfile__activityNum">
              {followers.length}
            </span>{" "}
            {followers.length === 1 ? "follower" : "followers"}
          </span>
          <span className="hoverProfile__activity-value">
            <span className="hoverProfile__activityNum">
              {following.length}
            </span>{" "}
            following
          </span>
        </div>
        <div className="hoverProfile__posts">
          {thisUserPosts.slice(0, 3).map((post) => {
            return <HoverPost post={post} username={username} key={post._id} />;
          })}
        </div>
        <div className="hoverProfile__followBtn">
          {currentUser._id !== _id ? (
            <button
              className="btn"
              onClick={() => {
                followUser();
              }}
            >
              {currentUser.following.find((followingId) => followingId === _id)
                ? "Unfollow"
                : "Follow"}
            </button>
          ) : (
            <button className="btn">Edit Profile</button>
          )}
        </div>
      </div>
    );
  }
};

export default HoverProfile;
