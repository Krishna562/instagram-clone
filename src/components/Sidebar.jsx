import { BiSearchAlt } from "react-icons/bi";
import { TbHome } from "react-icons/tb";
import { BsPlusSquare } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import InstagramLogo from "../assets/InstagramLogo.svg";
import { setIsCreateModalOpen } from "../store/reducers/Post/postReducer";
import { useDispatch, useSelector } from "react-redux";
import defaultProfilePic from "../assets/default profile pic.jpg";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { username, profilePic } = useSelector(
    (state) => state.user.currentUser
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <section className="sidebar">
      <div className="sidebar__logo">
        <img src={InstagramLogo} alt="instagram logo" />
      </div>
      <div className="sidebar__upper">
        <button
          className="sidebar__btn"
          onClick={() => {
            navigate("/");
          }}
        >
          <i className="sidebar__i">{<TbHome />}</i>
          <span className="sidebar__btnText">Home</span>
        </button>
        <button className="sidebar__btn">
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
            className="sidebar__i"
            src={profilePic ? profilePic : defaultProfilePic}
          />
          <span className="sidebar__btnText">Profile</span>
        </button>
      </div>
      <div className="sidebar__lower">
        <button className="sidebar__btn">
          <i className="sidebar__i">{<FaBars />}</i>
          <span className="sidebar__btnText">More</span>
        </button>
      </div>
    </section>
  );
};

export default Sidebar;
