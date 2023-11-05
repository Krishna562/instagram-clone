import { useRef, useEffect, useState } from "react";
import axios from "../../axios/axios";
import { useSelector, useDispatch } from "react-redux";
import { setAllUserPosts } from "../../store/reducers/User/userReducer";
import {
  setEditingPost,
  setTempTags,
} from "../../store/reducers/Post/postReducer";
import { setIsCreateModalOpen } from "../../store/reducers/Post/postReducer";

const OptionsModal = ({
  isOptionsModalOpen,
  setIsOptionsModalOpen,
  currentPostId,
}) => {
  const allUserPosts = useSelector((state) => state.user.allUserPosts);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isOptionsModalOpen) {
      modalRef.current.showModal();
    } else {
      modalRef.current.close();
    }
  }, [isOptionsModalOpen]);

  const modalRef = useRef();
  const optionsConRef = useRef();

  const deletePost = async () => {
    try {
      const result = await axios.delete(`/delete-post/${currentPostId}`);
      const updatedPosts = result.data.updatedPosts;
      dispatch(setAllUserPosts(updatedPosts));
    } catch (err) {
      console.log(err);
    }
  };

  const editPost = () => {
    const currentPost = allUserPosts.find(
      (currentUserPost) => currentUserPost._id === currentPostId
    );
    const { caption, postImg, tags } = currentPost;

    dispatch(
      setEditingPost({
        isEditing: true,
        props: { imgUrl: postImg, currentCaption: caption },
        postId: currentPostId,
      })
    );

    dispatch(setTempTags(tags));
    dispatch(setIsCreateModalOpen(true));

    setIsOptionsModalOpen(false);
  };

  return (
    <dialog
      ref={modalRef}
      className="options"
      onClick={(e) => {
        if (!optionsConRef.current.contains(e.target)) {
          setIsOptionsModalOpen(false);
        }
      }}
    >
      <ul className="options__con" ref={optionsConRef}>
        <li
          className="options__li"
          onClick={() => {
            deletePost();
          }}
        >
          Delete
        </li>
        <li
          className="options__li"
          onClick={() => {
            editPost();
          }}
        >
          Edit
        </li>
      </ul>
    </dialog>
  );
};

export default OptionsModal;
