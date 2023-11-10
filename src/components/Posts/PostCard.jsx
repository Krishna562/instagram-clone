import { FaComment } from "react-icons/fa";
import { BsFillHeartFill } from "react-icons/bs";
import PostModal from "./PostModal";
import { useState } from "react";

const PostCard = ({ post, creator }) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const { comments, likes, postImg } = post;
  return (
    <>
      <PostModal
        post={post}
        isPostModalOpen={isPostModalOpen}
        setIsPostModalOpen={setIsPostModalOpen}
        creator={creator}
      />
      <div
        className="profile__card lowerOpacity"
        onClick={() => {
          setIsPostModalOpen(true);
        }}
      >
        <img src={postImg} alt="post image" />

        {/* OVERLAY */}

        <div className="profile__card-overlay">
          <div className="profile__card-overlay-icon">
            <i>
              <BsFillHeartFill />
            </i>
            <span>{likes.length}</span>
          </div>
          <div className="profile__card-overlay-icon">
            <i>
              <FaComment />
            </i>
            <span>{comments.length}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
