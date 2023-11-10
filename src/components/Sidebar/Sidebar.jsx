import { BiSearchAlt } from "react-icons/bi";
import { TbHome } from "react-icons/tb";
import { BsPlusSquare, BsInstagram } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import InstagramLogo from "../../assets/InstagramLogo.svg";
import { setIsCreateModalOpen } from "../../store/reducers/Post/postReducer";
import { useDispatch, useSelector } from "react-redux";
import defaultProfilePic from "../../assets/default profile pic.jpg";
import { useNavigate } from "react-router-dom";
import MoreDialog from "./MoreDialog";
import { setIsMoreDialogOpen } from "../../store/reducers/More/moreReducer";
import {
  setIsSearchbarVisible,
  setSearchBtnRef,
} from "../../store/reducers/User/userReducer";
import { useEffect, useRef } from "react";

const Sidebar = () => {
  const { username, profilePic } = useSelector(
    (state) => state.user.currentUser
  );
  const isMoreDialogOpen = useSelector((state) => state.more.isMoreDialogOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchBtnRef = useRef();

  useEffect(() => {
    dispatch(setSearchBtnRef(searchBtnRef.current));
  }, []);

  return (
    <section className="sidebar">
      <div className="sidebar__upper">
        <div className="sidebar__logo" onClick={() => navigate("/")}>
          <img src={InstagramLogo} alt="instagram logo" />
          <button className="sidebar__btn">
            <BsInstagram className="sidebar__i" />
          </button>
        </div>
        <div className="sidebar__upper-btns">
          <button
            className="sidebar__btn"
            onClick={() => {
              navigate("/");
            }}
          >
            <i className="sidebar__i">{<TbHome />}</i>
            <span className="sidebar__btnText">Home</span>
          </button>
          <button
            ref={searchBtnRef}
            className="sidebar__btn"
            onClick={() => dispatch(setIsSearchbarVisible(true))}
          >
            <i className="sidebar__i">{<BiSearchAlt />}</i>
            <span className="sidebar__btnText">Search Users</span>
          </button>
          <button
            className="sidebar__btn"
            onClick={() => {
              dispatch(setIsCreateModalOpen(true));
            }}
          >
            <i className="sidebar__i">{<BsPlusSquare />}</i>
            <span className="sidebar__btnText">Add post</span>
          </button>
          <button
            className="sidebar__btn"
            onClick={() => {
              navigate(`/${username}`);
            }}
          >
            <img
              className="sidebar__i sidebar__profilePicIcon"
              src={profilePic ? profilePic : defaultProfilePic}
            />
            <span className="sidebar__btnText">Profile</span>
          </button>
        </div>
      </div>

      <div className="sidebar__lower">
        <MoreDialog />
        <button
          className="sidebar__btn"
          onClick={() => {
            dispatch(setIsMoreDialogOpen(!isMoreDialogOpen));
          }}
        >
          <i className="sidebar__i">{<FaBars />}</i>
          <span className="sidebar__btnText">More</span>
        </button>
      </div>
    </section>
  );
};

export default Sidebar;
