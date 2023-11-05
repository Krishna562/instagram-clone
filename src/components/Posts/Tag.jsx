import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  setAreTagsVisible,
  setTempTags,
} from "../../store/reducers/Post/postReducer";
import { useNavigate } from "react-router-dom";

const Tags = ({ username, position, areTagsVisible, setAreTagsVisible }) => {
  const tempTags = useSelector((state) => state.post.tempTags);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onDragStart = (e, username) => {
    e.dataTransfer.setData("text/plain", username);
  };

  const draggable = areTagsVisible ? false : true;

  return (
    <div
      className="tag"
      style={{
        left: `${position.horizontal}%`,
        top: `${position.vertical}%`,
      }}
      draggable={draggable}
      onDragStart={(e) => onDragStart(e, username)}
      onClick={() => {
        if (!areTagsVisible) return;
        navigate(`/${username}`);
        setAreTagsVisible(false);
      }}
    >
      <div className="tag__con">
        <span>{username}</span>
        {!areTagsVisible && (
          <AiOutlineClose
            className="tag__closeBtn"
            onClick={() => {
              dispatch(
                setTempTags(tempTags.filter((tag) => tag.username !== username))
              );
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Tags;
