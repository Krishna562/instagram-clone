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

  const { following, followers, profilePic, _id, isPrivate } = useSelector(
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

  const canCurrentUserAccess =
    (!isLoading &&
      currentUser.following.find((following) => following === _id)) ||
    !isPrivate ||
    _id === currentUser._id
      ? true
      : false;

  const hasFollowers = !isLoading && followers.length ? true : false;
  const isFollowingSomeone = !isLoading && following.length ? true : false;

  let followBtnText = "";
  if (currentUser.following.find((followingId) => followingId === _id)) {
    followBtnText = "Unfollow";
  } else if (
    currentUser.followRequestsSent.find((requestSent) => requestSent === _id)
  ) {
    followBtnText = "Requested";
  } else {
    followBtnText = "Follow";
  }

  if (!isLoading) {
    return (
      <section className="profile__con">
        <div className="profile__underSidebar"></div>
        <div className="profile__centerCon">
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
              <div className="profile__info-textInfo-con">
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
                      {followBtnText}
                    </button>
                  )}
                </div>

                {/* SMALL SCREEN - POST, FOLLOWERS, FOLLOWING TABS */}

                <div className="profile__info-status">
                  <div className="profile__info-status-tab">
                    <span>{allUserPosts.length}</span> posts
                  </div>
                  <div
                    className="profile__info-status-tab lowerOpacity"
                    style={{
                      cursor:
                        !canCurrentUserAccess || !hasFollowers ? "auto" : null,
                    }}
                    onClick={() => {
                      if (!canCurrentUserAccess || !hasFollowers) return;
                      setIsFollowModalOpen(true);
                      setIsFollowersTabActive(true);
                    }}
                  >
                    <span>{followers.length}</span>{" "}
                    {followers.length === 1 ? "follower" : "followers"}
                  </div>
                  <div
                    className="profile__info-status-tab lowerOpacity"
                    style={{
                      cursor:
                        !canCurrentUserAccess || !isFollowingSomeone
                          ? "auto"
                          : null,
                    }}
                    onClick={() => {
                      if (!canCurrentUserAccess || !isFollowingSomeone) return;
                      setIsFollowModalOpen(true);
                      setIsFollowersTabActive(false);
                    }}
                  >
                    <span>{following.length}</span> following
                  </div>
                </div>
              </div>
            </div>

            {/* LARGE SCREEN - POST, FOLLOWERS, FOLLOWING TABS */}

            <div className="profile__status">
              <div className="profile__status-tab">
                <span>{allUserPosts.length}</span> posts
              </div>
              <div
                className="profile__status-tab lowerOpacity"
                style={{
                  cursor:
                    !canCurrentUserAccess || !hasFollowers ? "auto" : null,
                }}
                onClick={() => {
                  if (!canCurrentUserAccess || !hasFollowers) return;
                  setIsFollowModalOpen(true);
                  setIsFollowersTabActive(true);
                }}
              >
                <span>{followers.length}</span>{" "}
                {followers.length === 1 ? "follower" : "followers"}
              </div>
              <div
                className="profile__status-tab lowerOpacity"
                style={{
                  cursor:
                    !canCurrentUserAccess || !isFollowingSomeone
                      ? "auto"
                      : null,
                }}
                onClick={() => {
                  if (!canCurrentUserAccess || !isFollowingSomeone) return;
                  setIsFollowModalOpen(true);
                  setIsFollowersTabActive(false);
                }}
              >
                <span>{following.length}</span> following
              </div>
            </div>

            {/* POST CATEGORIES */}

            {canCurrentUserAccess ? (
              <>
                <div className="profile__categories">
                  <i
                    className={`profile__categories-category ${
                      isPostsActive
                        ? "profile__categories-category-active"
                        : null
                    } lowerOpacity`}
                    onClick={() => {
                      setIsPostsActive(true);
                    }}
                  >
                    <BsGrid /> <span>Posts</span>
                  </i>
                  <i
                    className={`profile__categories-category ${
                      !isPostsActive
                        ? "profile__categories-category-active"
                        : null
                    } lowerOpacity`}
                    onClick={() => {
                      setIsPostsActive(false);
                    }}
                  >
                    <BsTag /> <span>Tagged</span>
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
                {allUserPosts.length === 0 && isPostsActive && (
                  <div className="noPosts">No posts</div>
                )}
                {taggedPosts.length === 0 && !isPostsActive && (
                  <div className="noPosts">No posts</div>
                )}
              </>
            ) : (
              <section className="notFollowing">
                This account is Private. Follow it to see its posts
              </section>
            )}
          </section>
        </div>
      </section>
    );
  }
};

export default Profile;
