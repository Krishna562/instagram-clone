import defaultProfilePic from "../../assets/default profile pic.jpg";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import ProfilePicModal from "./ProfilePicModal";
import { setErr } from "../../store/reducers/Error/errReducer";
import {
  setCurrentUser,
  setSpecificUser,
} from "../../store/reducers/User/userReducer";
import { useNavigate } from "react-router-dom";

const EditProfileModal = ({
  setIsEditProfileModalOpen,
  isEditProfileModalOpen,
}) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { username } = currentUser;

  const editProfileModalRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState(username);
  const [isProfilePicModalOpen, setIsProfilePicModalOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [imgFile, setImgFile] = useState({});

  useEffect(() => {
    if (isEditProfileModalOpen) {
      editProfileModalRef.current.showModal();
    } else {
      editProfileModalRef.current.close();
      setImgUrl("");
    }
  }, [isEditProfileModalOpen]);

  const updateCurrentUser = async (picFile, updatedUsername) => {
    const formData = new FormData();
    formData.append("imgFile", picFile);
    formData.append("username", updatedUsername);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/update-user`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );
      const result = await response.json();
      const updatedUser = result.updatedUser;
      dispatch(setCurrentUser(updatedUser));
      dispatch(setSpecificUser(updatedUser));
      navigate(`/${updatedUser.username}`);
    } catch (err) {
      console.log(err);
      dispatch(setErr(err));
    }
  };

  return (
    <dialog className="editProfile" ref={editProfileModalRef}>
      <ProfilePicModal
        setIsProfilePicModalOpen={setIsProfilePicModalOpen}
        isProfilePicModalOpen={isProfilePicModalOpen}
        imgUrl={imgUrl}
        setImgUrl={setImgUrl}
        setImgFile={setImgFile}
      />
      <AiOutlineClose
        className="editProfile__closeBtn"
        onClick={() => {
          setIsEditProfileModalOpen(false);
        }}
      />
      <form className="editProfile__con" onSubmit={(e) => e.preventDefault()}>
        <div className="editProfile__upper">
          <img
            src={
              imgUrl || currentUser.profilePic
                ? imgUrl || currentUser.profilePic
                : defaultProfilePic
            }
            alt="profile pic"
          />
          <div
            className="editProfile__changePic"
            onClick={() => {
              setIsProfilePicModalOpen(true);
            }}
          >
            Change Profile Picture
          </div>
          <div className="editProfile__changeUsername">
            <p>Username</p>
            <input
              type="text"
              name="changeUsername"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
              }}
            />
          </div>
        </div>
        <button
          style={{
            backgroundColor:
              inputVal.length < 3 ? "var(--NOT-ACTIVE-BACKGROUND)" : null,
          }}
          className="btn editProfile__saveBtn"
          onClick={() => {
            if (inputVal.length < 3 || !imgFile) {
              return;
            }
            updateCurrentUser(imgFile, inputVal);
            setIsEditProfileModalOpen(false);
          }}
        >
          Save Changes
        </button>
      </form>
    </dialog>
  );
};

export default EditProfileModal;
