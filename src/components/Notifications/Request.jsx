import { useDispatch, useSelector } from "react-redux";
import defaultProfilePic from "../../assets/default profile pic.jpg";
import axios from "../../axios/axios";
import {
  setCurrentUser,
  setWillHideNotifBar,
} from "../../store/reducers/User/userReducer";
import { useNavigate } from "react-router-dom";

const Request = ({ user }) => {
  const { profilePic, username, _id } = user;

  const currentUser = useSelector((state) => state.user.currentUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFollowRequest = async (actionType) => {
    try {
      const result = await axios.put("/follow-request", {
        actionType: actionType,
        followRequesterId: _id,
        currentUserId: currentUser._id,
      });
      dispatch(setCurrentUser(result.data.updatedCurrentUser));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="followRequest"
      onClick={() => {
        dispatch(setWillHideNotifBar(true));
        navigate(`/${username}`);
      }}
    >
      <img src={profilePic || defaultProfilePic} alt="profile pic" />
      <div className="followRequest__message">
        <p>
          <span className="followRequest__username">{username}</span> requested
        </p>
        <p>to follow you</p>
      </div>
      <div className="followRequest__actionBtnCon">
        <button
          className="btn"
          onClick={(e) => {
            e.stopPropagation();
            handleFollowRequest("accept");
          }}
        >
          Confirm
        </button>
        <button
          className="btn followRequest__deleteBtn"
          onClick={(e) => {
            e.stopPropagation();
            handleFollowRequest("reject");
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Request;
