import { useDropzone } from "react-dropzone";
import { useRef, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiSolidRightArrowCircle } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsCreateModalOpen,
  setCurrentPost,
  setIsCaptionSectionVisible,
} from "../../store/reducers/Post/postReducer";
import { setErr } from "../../store/reducers/Error/errReducer";
import { setAllUserPosts } from "../../store/reducers/User/userReducer";
import defaultProfilePic from "../../assets/default profile pic.jpg";
import { useState } from "react";

const CreatePost = () => {
  const dispatch = useDispatch();

  const isModalOpen = useSelector((state) => state.post.isCreateModalOpen);
  const currentUser = useSelector((state) => state.user.currentUser);
  const allUserPosts = useSelector((state) => state.user.allUserPosts);

  const [imgFile, setImgFile] = useState();
  const [imgUrl, setImgUrl] = useState("");

  const isCaptionSectionVisible = useSelector(
    (state) => state.post.isCaptionSectionVisible
  );

  const onDrop = (file) => {
    const imgUrl = URL.createObjectURL(file[0]);
    setImgFile(file[0]);
    setImgUrl(imgUrl);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
  });

  const modalRef = useRef(0);
  const captionAreaRef = useRef(0);
  const captionRef = useRef("");

  const createPost = async (caption, imgFile) => {
    const formData = new FormData();
    formData.append("imgFile", imgFile);
    formData.append("caption", caption);
    try {
      const response = await fetch("http://localhost:3000/createPost", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      const result = await response.json();
      const newPost = result.newPost;
      dispatch(setCurrentPost(newPost));
      const updatedUserPosts = [...allUserPosts, newPost];
      dispatch(setAllUserPosts(updatedUserPosts));
    } catch (err) {
      dispatch(setErr(err.response.data));
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      modalRef.current.showModal();
    } else {
      modalRef.current.close();
      dispatch(setIsCreateModalOpen(false));
    }
  }, [isModalOpen]);

  const MODAL_WIDTH = modalRef.current.offsetWidth;

  return (
    <dialog
      className="createPost"
      ref={modalRef}
      style={{
        width: isCaptionSectionVisible
          ? MODAL_WIDTH + (MODAL_WIDTH * 30) / 100
          : null,
        maxWidth: isCaptionSectionVisible
          ? MODAL_WIDTH + (MODAL_WIDTH * 30) / 100
          : null,
      }}
    >
      <div className="createPost__container">
        {!isCaptionSectionVisible ? (
          <AiOutlineCloseCircle
            className="createPost__close-btn"
            onClick={() => {
              dispatch(setIsCreateModalOpen(false));
              setImgUrl("");
            }}
          />
        ) : (
          <BiSolidRightArrowCircle
            className="createPost__prev-btn"
            onClick={() => {
              dispatch(setIsCaptionSectionVisible(false));
            }}
          />
        )}

        {imgUrl && !isCaptionSectionVisible && (
          <BiSolidRightArrowCircle
            className="createPost__next-btn"
            onClick={() => {
              dispatch(setIsCaptionSectionVisible(true));
            }}
          />
        )}

        <h3 className="createPost__heading">Create new post</h3>

        <section className="createPost__createArea">
          {imgUrl && (
            <div className="createPost__previewImg">
              <img src={imgUrl} alt="image preview" />
            </div>
          )}

          {/* CAPTION SECTION */}

          {imgUrl && (
            <section
              ref={captionAreaRef}
              className="createPost__captionSection"
              style={{
                flexBasis: isCaptionSectionVisible ? "40%" : "0%",
                padding: isCaptionSectionVisible ? "1rem" : "0rem",
              }}
            >
              <div className="createPost__captionSection-creator">
                <img
                  src={
                    currentUser.profilePic
                      ? currentUser.profilePic
                      : defaultProfilePic
                  }
                  alt="p"
                />
                <span>{currentUser.username}</span>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <textarea
                  name="caption"
                  type="text"
                  placeholder="Write a caption..."
                  ref={captionRef}
                />

                <button
                  className="btn"
                  onClick={() => {
                    createPost(captionRef.current.value, imgFile);
                    dispatch(setIsCreateModalOpen(false));
                  }}
                >
                  Share
                </button>
              </form>
            </section>
          )}

          {/* DROPZONE */}

          {!imgUrl && (
            <div {...getRootProps({ className: "createPost__dropzone" })}>
              <div
                className="createPost__dropzone-boundary"
                style={{
                  border: isDragActive
                    ? "1px dashed dodgerblue"
                    : "var(--DROPZONE-BOUNDARY)",
                }}
              >
                <input
                  {...getInputProps({
                    type: "file",
                    accept: "image/*",
                    className: "createPost__dropzone-input",
                  })}
                />
                <p className="createPost__dropzone-text">
                  {isDragActive ? (
                    <span style={{ color: "dodgerblue", fontWeight: 700 }}>
                      Drop the image here
                    </span>
                  ) : (
                    <span>Drag 'n' drop the image here</span>
                  )}
                </p>
                <p
                  className="createPost__dropzone-text"
                  style={{ display: isDragActive ? "none" : "block" }}
                >
                  Or click anywhere inside this box to browse image from device
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </dialog>
  );
};

export default CreatePost;
