import { useNavigate } from "react-router-dom";

const HoverPost = ({ post, username }) => {
  const navigate = useNavigate();

  return (
    <>
      <div
        className="hoverProfile__postImg"
        onClick={() => {
          navigate(`/${username}`);
        }}
      >
        <img src={post.postImg} alt="post image" />
      </div>
    </>
  );
};

export default HoverPost;
