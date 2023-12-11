import { useDropzone } from "react-dropzone";
import { useRef, useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BiSolidRightArrowCircle } from "react-icons/bi";
import { IoMdReverseCamera } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsCreateModalOpen,
  setCurrentPost,
  setIsCaptionSectionVisible,
  setEditingPost,
  setAllPosts,
} from "../../store/reducers/Post/postReducer";
import { setErr } from "../../store/reducers/Error/errReducer";
import { setAllUserPosts } from "../../store/reducers/User/userReducer";
import defaultProfilePic from "../../assets/default profile pic.jpg";
import { useState } from "react";
import axios from "../../axios/axios";
import {
  setTagDialog,
  setTempTags,
} from "../../store/reducers/Post/postReducer";
import SearchTagDialog from "./SearchTagDialog";
import Tag from "./Tag";

const CreatePost = () => {
  const dispatch = useDispatch();

  const isModalOpen = useSelector((state) => state.post.isCreateModalOpen);
  const currentUser = useSelector((state) => state.user.currentUser);
  const allUserPosts = useSelector((state) => state.user.allUserPosts);
  const editingPost = useSelector((state) => state.post.editingPost);
  const tempTags = useSelector((state) => state.post.tempTags);
  const allPosts = useSelector((state) => state.post.allPosts);

  const [imgFile, setImgFile] = useState();
  const [imgUrl, setImgUrl] = useState("");
  const [captionVal, setCaptionVal] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [tagDialogRef, setTagDialogRef] = useState();
  const [isTagInstructionVisible, setIsTagInstructionVisible] = useState(false);

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
  const previewImgRef = useRef();
  const createPostPreviewImg = useRef();

  const createPost = async (caption, imgFile, tags) => {
    const formData = new FormData();
    formData.append("imgFile", imgFile);
    formData.append("caption", caption);
    formData.append("tags", JSON.stringify(tags));
    const apiUrl =
      import.meta.env.MODE === "production"
        ? import.meta.env.VITE_ONRENDER_API_URL
        : import.meta.env.VITE_API_URL;
    try {
      const response = await fetch(`${apiUrl}/createPost`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      console.log(response);
      const result = await response.json();
      const newPost = result.newPost;
      dispatch(setCurrentPost(newPost));
      dispatch(setAllUserPosts([newPost, ...allUserPosts]));
      dispatch(setAllPosts([newPost, ...allPosts]));
      dispatch(setTempTags([]));
    } catch (err) {
      console.log(err);
    }
  };

  const editPost = async (editedCaption, editedTags) => {
    try {
      const result = await axios.patch(`/edit-post/${editingPost.postId}`, {
        newCaption: editedCaption,
        editedTags: editedTags,
      });
      const updatedPost = result.data.updatedPost;
      const updatedUserPosts = allUserPosts.map((userPost) =>
        userPost._id === updatedPost._id ? updatedPost : userPost
      );
      dispatch(setAllUserPosts(updatedUserPosts));
    } catch (err) {
      console.log(err);
      dispatch(setErr(err.response.data));
    }
  };

  const setTagDialogPosition = (e) => {
    if (!e.target.contains(createPostPreviewImg.current)) return;
    const rect = e.target.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const height = rect.height;
    const width = rect.width;

    const topPercent = (y / height) * 100;
    const leftPercent = (x / width) * 100;

    dispatch(
      setTagDialog({
        isOpen: true,
        position: { horizontal: leftPercent, vertical: topPercent },
      })
    );
  };

  const handleClick = (e) => {
    if (
      tagDialogRef &&
      !tagDialogRef.contains(e.target) &&
      isCaptionSectionVisible &&
      !previewImgRef.current.contains(e.target)
    ) {
      dispatch(
        setTagDialog({
          isOpen: false,
          position: { horizontal: 0, vertical: 0 },
        })
      );
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      modalRef.current.showModal();
      if (editingPost.isEditing) {
        setImgUrl(editingPost.props.imgUrl);
        setCaptionVal(editingPost.props.currentCaption);
        dispatch(setIsCaptionSectionVisible(true));
      }
    } else {
      modalRef.current.close();
      dispatch(setIsCaptionSectionVisible(false));
      setImgUrl("");
      setCaptionVal("");
      dispatch(setEditingPost({ isEditing: false, props: {}, postId: "" }));
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isHovering && imgUrl) {
      previewImgRef.current.classList.add("crosshairOnHover");
    } else if (!isHovering && imgUrl) {
      previewImgRef.current.classList.remove("crosshairOnHover");
    }
  }, [isHovering]);

  useEffect(() => {
    if (isTagInstructionVisible)
      setTimeout(() => {
        setIsTagInstructionVisible(false);
      }, 4000);
  }, [isTagInstructionVisible]);

  return (
    <dialog
      className="createPost"
      onClose={() => {
        dispatch(setIsCreateModalOpen(false));
      }}
      ref={modalRef}
      style={{
        width: isCaptionSectionVisible ? "95%" : null,
      }}
      onClick={(e) => handleClick(e)}
    >
      <div className="createPost__container">
        {!isCaptionSectionVisible || editingPost.isEditing ? (
          <AiOutlineCloseCircle
            className="createPost__close-btn"
            onClick={() => {
              dispatch(setIsCreateModalOpen(false));
              dispatch(setTempTags([]));
            }}
          />
        ) : (
          <BiSolidRightArrowCircle
            className="createPost__prev-btn"
            onClick={() => {
              dispatch(setIsCaptionSectionVisible(false));
              setIsTagInstructionVisible(false);
              dispatch(setTempTags([]));
            }}
          />
        )}

        {imgUrl && !isCaptionSectionVisible && (
          <div className="createPost__rightBtnCon">
            <IoMdReverseCamera
              className="profilePicModal__changePicBtn"
              style={{
                color: imgUrl ? "red" : "var(--LIGHT-TEXT-COLOR)",
              }}
              onClick={() => {
                setImgUrl("");
              }}
            />
            <BiSolidRightArrowCircle
              className="createPost__next-btn"
              onClick={() => {
                dispatch(setIsCaptionSectionVisible(true));
                setTimeout(() => setIsTagInstructionVisible(true), 1000);
              }}
            />
          </div>
        )}

        <h3 className="createPost__heading">
          {editingPost.isEditing ? "Edit Post" : "Create new post"}
        </h3>

        <section className="createPost__createArea">
          {imgUrl && (
            <div
              className="createPost__previewImg"
              style={{
                flexBasis: isCaptionSectionVisible ? "60%" : "100%",
              }}
              ref={previewImgRef}
              onMouseOver={() => {
                if (isCaptionSectionVisible) setIsHovering(true);
              }}
              onMouseLeave={() => setIsHovering(false)}
              onClick={(e) => {
                if (!isCaptionSectionVisible) return;
                setTagDialogPosition(e);
              }}
            >
              {isTagInstructionVisible && isCaptionSectionVisible && (
                <div className="createPost__tagInstruction">
                  Click on the post image to tag people
                </div>
              )}
              <SearchTagDialog setTagDialogRef={setTagDialogRef} />
              {tempTags.map((tag) => {
                const { username, position } = tag;
                return (
                  <Tag username={username} position={position} key={username} />
                );
              })}
              <img
                src={imgUrl}
                alt="image preview"
                ref={createPostPreviewImg}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  const username = e.dataTransfer.getData("text");
                  const screenX = e.clientX;
                  const screenY = e.clientY;

                  const rect = e.target.getBoundingClientRect();

                  const leftPx = screenX - rect.left;
                  const topPx = screenY - rect.top;

                  const left = (leftPx / rect.width) * 100;
                  const top = (topPx / rect.height) * 100;

                  const updatedTempTags = tempTags.map((tempTag) => {
                    return tempTag.username === username
                      ? {
                          ...tempTag,
                          position: { horizontal: left, vertical: top },
                        }
                      : tempTag;
                  });
                  dispatch(setTempTags(updatedTempTags));
                }}
              />
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
                  value={captionVal}
                  onChange={(e) => {
                    setCaptionVal(e.target.value);
                  }}
                />

                <button
                  className="btn"
                  style={{
                    background: !captionVal
                      ? "var(--NOT-ACTIVE-BACKGROUND)"
                      : null,
                  }}
                  onClick={() => {
                    if (editingPost.isEditing) {
                      if (!captionVal) {
                        return;
                      }
                      editPost(captionVal, tempTags);
                    } else {
                      if (!captionVal || !imgFile) {
                        return;
                      }
                      createPost(captionVal, imgFile, tempTags);
                    }
                    dispatch(setIsCreateModalOpen(false));
                  }}
                >
                  {editingPost.isEditing ? "Edit" : "Share"}
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
                <div className="createPost__dropzone-text">
                  {isDragActive ? (
                    <p style={{ color: "dodgerblue", fontWeight: 700 }}>
                      Drop the image here
                    </p>
                  ) : (
                    <p
                      className="createPost__dropzone-instructions"
                      style={{ display: !isDragActive ? "flex" : "none" }}
                    >
                      <span>Drag 'n' drop the image here</span>
                      <span>
                        Or click anywhere inside this box to browse image from
                        device
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </dialog>
  );
};

export default CreatePost;
