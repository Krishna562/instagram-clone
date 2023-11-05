import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setErr } from "../../store/reducers/Error/errReducer";
import axios from "../../axios/axios";
import { setAllUsers } from "../../store/reducers/User/userReducer";
import defaultProfilePic from "../../assets/default profile pic.jpg";
import {
  setTagDialog,
  setTempTags,
} from "../../store/reducers/Post/postReducer";

const SearchTagDialog = ({ setTagDialogRef }) => {
  const { isOpen, position } = useSelector((state) => state.post.tagDialog);
  const tempTags = useSelector((state) => state.post.tempTags);

  const allUsers = useSelector((state) => state.user.allUsers);

  const [searchValue, setSearchValue] = useState("");

  const dispatch = useDispatch();

  const dialogRef = useRef();

  const getAllUsers = async () => {
    try {
      const result = await axios.get("/allUsers");
      const allUsers = result.data.allUsers;
      dispatch(setAllUsers(allUsers));
    } catch (err) {
      console.log(err);
      dispatch(setErr(err.response.data));
    }
  };

  const addTempTag = (username) => {
    let tagArr = [...tempTags];
    const existingTag = tagArr.find((tag) => tag.username === username);
    if (existingTag) {
      const updatedExistingTag = { ...existingTag, position: position };
      const updatedTagArr = tagArr.map((tag) =>
        tag.username === username ? updatedExistingTag : tag
      );
      tagArr = updatedTagArr;
    } else {
      const newTempTag = {
        username: username,
        position: position,
      };
      tagArr.push(newTempTag);
    }

    setSearchValue("");
    dispatch(setTagDialog({ isOpen: false, position: {} }));
    dispatch(setTempTags(tagArr));
  };

  useEffect(() => {
    if (isOpen) setTagDialogRef(dialogRef.current);
  }, [isOpen]);

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div
      ref={dialogRef}
      className="tagDialog"
      style={{
        display: isOpen ? "block" : "none",
        left: `${position.horizontal}%`,
        top: `${position.vertical}%`,
      }}
    >
      <div className="tagDialog__con">
        <h4 className="tagDialog__header">
          <label
            onClick={() => {
              dispatch(
                setTagDialog({
                  isOpen: false,
                  position: { horizontal: 0, vertical: 0 },
                })
              );
            }}
          >
            Tag :
          </label>
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </h4>
        {searchValue && (
          <div className="tagDialog__results">
            {allUsers.map((user) => {
              const { profilePic, username, _id } = user;
              if (!username.toLowerCase().includes(searchValue.toLowerCase()))
                return;
              return (
                <div
                  className="tagDialog__resultUser"
                  key={_id}
                  onClick={() => {
                    addTempTag(username);
                  }}
                >
                  <img
                    src={profilePic || defaultProfilePic}
                    alt="profile pic"
                  />
                  <span>{username}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTagDialog;
