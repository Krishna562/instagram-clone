import { BsTag, BsGrid } from "react-icons/bs";
import defaultProfilePic from "../assets/default profile pic.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setErr } from "../store/reducers/Error/errReducer";
import CreatePost from "./Posts/CreatePost";
import { useEffect, useState } from "react";
import axios from "../axios/axios";
import { useParams } from "react-router-dom";
import {
  setSpecificUser,
  setAllUserPosts,
} from "../store/reducers/User/userReducer";
import PostCard from "./Posts/PostCard";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPostsActive, setIsPostsActive] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const dispatch = useDispatch();
  const username = useParams().username;
  const navigate = useNavigate();

  const allUserPosts = useSelector((state) => state.user.allUserPosts);
  const { following, followers, profilePic } = useSelector(
    (state) => state.user.specificUser
  );

  const getSpecificUserAndHisPosts = async () => {
    try {
      const result = await axios.get(`/specificUser/${username}`);
      if (result.status === 404) {
        navigate("/404");
      }
      const { userPosts, specificUser } = result.data;
      dispatch(setSpecificUser(specificUser));
      dispatch(setAllUserPosts(userPosts));
    } catch (err) {
      dispatch(setErr(err.response.data));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getSpecificUserAndHisPosts();
  }, [username]);

  if (!isLoading) {
    return (
      <>
        <section className="profile">
          <CreatePost />
          <header className="profile__header">
            <p>{username}</p>
          </header>

          {/* PROFILE INFO */}

          <div className="profile__info">
            <div className="profile__info-img">
              <img
                src={profilePic ? profilePic : defaultProfilePic}
                alt="profile pic"
                onClick={() => {
                  setIsProfileModalOpen(true);
                }}
              />
            </div>
            <div className="profile__info-textInfo">
              <p>{username}</p>
              <button>Edit Profile</button>
            </div>
          </div>
          <div className="profile__status">
            <div className="profile__status-tab">
              <span>{allUserPosts.length}</span> posts
            </div>
            <div className="profile__status-tab">
              <span>{followers.length}</span> followers
            </div>
            <div className="profile__status-tab">
              <span>{following.length}</span> following
            </div>
          </div>
          <div className="profile__categories">
            <i
              className={`profile__categories-category ${
                isPostsActive ? "profile__categories-category-active" : null
              }`}
              onClick={() => {
                setIsPostsActive(true);
              }}
            >
              <BsGrid />
            </i>
            <i
              className={`profile__categories-category ${
                !isPostsActive ? "profile__categories-category-active" : null
              }`}
              onClick={() => {
                setIsPostsActive(false);
              }}
            >
              <BsTag />
            </i>
          </div>

          {/* PROFILE GRID */}

          <div className="profile__grid">
            {allUserPosts.map((post) => {
              return <PostCard key={post._id} post={post} />;
            })}
          </div>
        </section>
      </>
    );
  }
};

export default Profile;
