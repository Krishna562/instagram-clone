import { useEffect, useRef, useState } from "react";
import axios from "../../axios/axios";
import { useDispatch, useSelector } from "react-redux";
import { setErr } from "../../store/reducers/Error/errReducer";
import { useNavigate } from "react-router-dom";
import {
  setCurrentUser,
  setIsNotifBarVisible,
  setWillHideNotifBar,
} from "../../store/reducers/User/userReducer";
import Request from "./Request";

const NotificationBar = () => {
  const isNotifBarVisible = useSelector(
    (state) => state.user.isNotifBarVisible
  );
  const notifBtnRef = useSelector((state) => state.user.notifBtnRef);
  const willHideNotifBar = useSelector((state) => state.user.willHideNotifBar);

  const { followRequestsRecieved, isPrivate } = useSelector(
    (state) => state.user.currentUser
  );

  const dispatch = useDispatch();
  const notifBarRef = useRef();

  const handleClickOutside = () => {
    dispatch(setWillHideNotifBar(true));
  };

  const getCurrentUser = async () => {
    try {
      const result = await axios.get("/loggedIn");
      dispatch(setCurrentUser(result.data.user));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // HANDLE CLICK OUTSIDE

    document.addEventListener("click", handleClickOutside);

    getCurrentUser();

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isNotifBarVisible]);

  if (isNotifBarVisible) {
    return (
      <div
        className="notifBar"
        style={{
          animation: !willHideNotifBar
            ? "showAnimation 0.3s"
            : "hideAnimation 0.3s",
        }}
        onAnimationEnd={() => {
          if (isNotifBarVisible && willHideNotifBar)
            dispatch(setIsNotifBarVisible(false));
        }}
        ref={notifBarRef}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="notifBar__header">Follow requests</h2>

        {/* REQUESTS CONTAINER */}

        <section className="notifBar__requestsCon">
          {followRequestsRecieved.length > 0 ? (
            followRequestsRecieved.map((request) => {
              return <Request user={request} key={request._id} />;
            })
          ) : (
            <div className="notifBar__noRequests">No requests</div>
          )}
        </section>
      </div>
    );
  }
};

export default NotificationBar;
