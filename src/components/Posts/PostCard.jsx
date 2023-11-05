import { FaComment } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";
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
        className="profile__card"
        onClick={() => {
          setIsPostModalOpen(true);
        }}
      >
        <img src={postImg} alt="post image" />

        {/* OVERLAY */}

        <div className="profile__card-overlay">
          <div className="profile__card-overlay-icon">
            <AiFillHeart />
            <span>{likes.length}</span>
          </div>
          <div className="profile__card-overlay-icon">
            <FaComment />
            <span>{comments.length}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
