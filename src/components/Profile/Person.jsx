import { useDispatch, useSelector } from "react-redux";
import defaultProfilePic from "../../assets/default profile pic.jpg";
import { setCurrentUser } from "../../store/reducers/User/userReducer";
import axios from "../../axios/axios";
import { useNavigate } from "react-router-dom";

const Person = ({ person, setIsFollowModalOpen }) => {
  const { username, profilePic, _id } = person;

  const currentUser = useSelector((state) => state.user.currentUser);

  const isCurrentUserFollowing = currentUser.following.find(
    (followingId) => followingId === _id
  )
    ? true
    : false;

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <div className="followModal__person">
      <div
        className="followModal__userInfo"
        onClick={() => {
          setIsFollowModalOpen(false);
          navigate(`/${username}`);
        }}
      >
        <img src={profilePic || defaultProfilePic} alt="profilePic" />
        <span>{username}</span>
      </div>
      {currentUser._id !== _id && (
        <button
          className="btn"
          style={{
            backgroundColor: isCurrentUserFollowing
              ? "var(--NOT-ACTIVE-BACKGROUND)"
              : null,
          }}
          onClick={() => followUser()}
        >
          {isCurrentUserFollowing ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default Person;
