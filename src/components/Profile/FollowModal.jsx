import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setErr } from "../../store/reducers/Error/errReducer";
import axios from "../../axios/axios";
import Person from "./Person";

const FollowModal = ({
  isFollowModalOpen,
  setIsFollowModalOpen,
  isFollowersTabActive,
}) => {
  const [people, setPeople] = useState({ followers: [], following: [] });
  const { followers, following } = people;

  const { _id } = useSelector((state) => state.user.specificUser);

  const modalRef = useRef();

  const dispatch = useDispatch();

  const scrollYValue = window.scrollY;
  const scrollXValue = window.scrollX;
  const scrollToPrevVal = () => {
    window.scrollTo(scrollXValue, scrollYValue);
  };

  const getPeople = async () => {
    try {
      const result = await axios.get(`/get-people/${_id}`);
      const people = result.data.people;
      setPeople(people);
    } catch (err) {
      dispatch(setErr(err.response.data));
    }
  };

  useEffect(() => {
    if (isFollowModalOpen) {
      window.onscroll = scrollToPrevVal;
      modalRef.current.showModal();
    } else {
      window.onscroll = function () {};
      modalRef.current.close();
    }
  }, [isFollowModalOpen]);

  useEffect(() => {
    getPeople();
  }, [_id]);

  return (
    <dialog ref={modalRef} className="followModal">
      <div className="followModal__con">
        <h4 className="followModal__header">
          {isFollowersTabActive ? "Followers" : "Following"}
          <AiOutlineClose
            className="followModal__closeBtn"
            onClick={() => {
              setIsFollowModalOpen(false);
            }}
          />
        </h4>
        <div className="followModal__people">
          {isFollowersTabActive
            ? followers.map((follower) => {
                return (
                  <Person
                    person={follower}
                    key={follower._id}
                    setIsFollowModalOpen={setIsFollowModalOpen}
                  />
                );
              })
            : following.map((followingUser) => {
                return (
                  <Person
                    person={followingUser}
                    key={followingUser._id}
                    setIsFollowModalOpen={setIsFollowModalOpen}
                  />
                );
              })}
        </div>
      </div>
    </dialog>
  );
};

export default FollowModal;
