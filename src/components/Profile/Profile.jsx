import { BsTag, BsGrid } from "react-icons/bs";
import defaultProfilePic from "../../assets/default profile pic.jpg";
import { useDispatch, useSelector } from "react-redux";
import { setErr } from "../../store/reducers/Error/errReducer";
import CreatePost from "../Posts/CreatePost";
import { useEffect, useState } from "react";
import axios from "../../axios/axios";
import { useParams } from "react-router-dom";
import {
  setSpecificUser,
  setAllUserPosts,
  setCurrentUser,
} from "../../store/reducers/User/userReducer";
import PostCard from "../Posts/PostCard";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "./EditProfileModal";
import FollowModal from "./FollowModal";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPostsActive, setIsPostsActive] = useState(true);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [taggedPosts, setTaggedPosts] = useState([]);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [isFollowersTabActive, setIsFollowersTabActive] = useState(true);

  const dispatch = useDispatch();
  const username = useParams().username;
  const navigate = useNavigate();

  const allUserPosts = useSelector((state) => state.user.allUserPosts);
  const currentUser = useSelector((state) => state.user.currentUser);

  const { following, followers, profilePic, _id } = useSelector(
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
      if (err.response.status === 404) {
        navigate("/404");
      }
      dispatch(setErr(err.response.data));
    } finally {
      setIsLoading(false);
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

  const getTaggedPosts = async () => {
    try {
      const result = await axios.get(`/tagged-posts/${username}`);
      if (result.status === 404) {
        navigate("/404");
      }
      const taggedPosts = result.data.taggedPosts;
      setTaggedPosts(taggedPosts);
    } catch (err) {
      if (err.response.status === 404) {
        navigate("/404");
      }
      dispatch(setErr(err.response.data));
    }
  };

  useEffect(() => {
    getSpecificUserAndHisPosts();
  }, [username]);

  useEffect(() => {
    getTaggedPosts();
  }, [isPostsActive]);

  if (!isLoading) {
    return (
      <section className="profile">
        <CreatePost />

        <EditProfileModal
          isEditProfileModalOpen={isEditProfileModalOpen}
          setIsEditProfileModalOpen={setIsEditProfileModalOpen}
        />

        <FollowModal
          isFollowModalOpen={isFollowModalOpen}
          setIsFollowModalOpen={setIsFollowModalOpen}
          isFollowersTabActive={isFollowersTabActive}
        />

        <header className="profile__header">
          <p>{username}</p>
        </header>

        {/* PROFILE INFO */}

        <div className="profile__info">
          <div className="profile__info-img">
            <img
              src={profilePic ? profilePic : defaultProfilePic}
              alt="profile pic"
            />
          </div>
          <div className="profile__info-textInfo">
            <p>{username}</p>
            {currentUser.username === username ? (
              <button
                onClick={() => {
                  setIsEditProfileModalOpen(true);
                }}
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  followUser();
                }}
              >
                {currentUser.following.find(
                  (followingId) => followingId === _id
                )
                  ? "Unfollow"
                  : "Follow"}
              </button>
            )}
          </div>
        </div>
        <div className="profile__status">
          <div className="profile__status-tab">
            <span>{allUserPosts.length}</span> posts
          </div>
          <div
            className="profile__status-tab"
            onClick={() => {
              setIsFollowModalOpen(true);
              setIsFollowersTabActive(true);
            }}
          >
            <span>{followers.length}</span>{" "}
            {followers.length === 1 ? "follower" : "followers"}
          </div>
          <div
            className="profile__status-tab"
            onClick={() => {
              setIsFollowModalOpen(true);
              setIsFollowersTabActive(false);
            }}
          >
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
          {isPostsActive
            ? allUserPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            : taggedPosts.map((taggedPost) => (
                <PostCard
                  key={taggedPost._id}
                  post={taggedPost}
                  creator={taggedPost.creatorId}
                />
              ))}
        </div>
      </section>
    );
  }
};

export default Profile;
