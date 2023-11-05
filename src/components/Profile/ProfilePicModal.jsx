import { useSelector, useDispatch } from "react-redux";
import { useRef, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoMdReverseCamera } from "react-icons/io";

const ProfilePicModal = ({
  setIsProfilePicModalOpen,
  isProfilePicModalOpen,
  imgUrl,
  setImgUrl,
  setImgFile,
}) => {
  const onDrop = (file) => {
    const url = URL.createObjectURL(file[0]);
    setImgFile(file[0]);
    setImgUrl(url);
  };

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop: onDrop,
  });

  const modalRef = useRef();

  useEffect(() => {
    if (isProfilePicModalOpen) {
      modalRef.current.showModal();
    } else {
      modalRef.current.close();
    }
  }, [isProfilePicModalOpen]);

  return (
    <dialog className="createPost" ref={modalRef}>
      <div className="createPost__container">
        <AiOutlineCloseCircle
          className="createPost__close-btn"
          onClick={() => {
            setIsProfilePicModalOpen(false);
            setImgUrl("");
            setImgFile({});
          }}
        />

        <div className="profilePicModal__btns">
          <IoMdReverseCamera
            className="profilePicModal__changePicBtn"
            style={{
              color: imgUrl ? "red" : "var(--LIGHT-TEXT-COLOR)",
            }}
            onClick={() => {
              setImgUrl("");
            }}
          />
          <button
            className="profilePicModal__saveBtn"
            style={{
              color: imgUrl ? "dodgerblue" : "var(--LIGHT-TEXT-COLOR)",
            }}
            onClick={() => {
              setIsProfilePicModalOpen(false);
            }}
          >
            save
          </button>
        </div>

        <h3 className="createPost__heading">Upload profile pic</h3>

        <section className="createPost__createArea">
          {imgUrl && (
            <div className="createPost__previewImg">
              <img src={imgUrl} alt="image preview" />
            </div>
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

export default ProfilePicModal;
