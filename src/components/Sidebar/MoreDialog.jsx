import { BiMoon, BiLogOut } from "react-icons/bi";
import { MdLightMode, MdPublic, MdPublicOff } from "react-icons/md";
import { AiFillCaretLeft } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsMoreDialogOpen,
  setIsDarkTheme,
} from "../../store/reducers/More/moreReducer";
import axios from "../../axios/axios";
import {
  checkAuthStatus,
  setCurrentUser,
} from "../../store/reducers/User/userReducer";

const MoreDialog = () => {
  const isMoreDialogOpen = useSelector((state) => state.more.isMoreDialogOpen);
  const isDarkTheme = useSelector((state) => state.more.isDarkTheme);
  const currentUser = useSelector((state) => state.user.currentUser);
  const { isPrivate } = currentUser;

  const [subSection, setSubSection] = useState({
    isVisible: true,
    section: "",
  });

  const { isVisible, section } = subSection;

  const dispatch = useDispatch();

  const dialogRef = useRef();

  useEffect(() => {
    if (isMoreDialogOpen) {
      dialogRef.current.show();
    } else {
      dialogRef.current.close();
      setSubSection({ isVisible: false, section: "" });
    }
  }, [isMoreDialogOpen]);

  const logout = async () => {
    try {
      await axios.delete("/logout");
      dispatch(checkAuthStatus(false));
    } catch (err) {
      console.log(err);
    }
  };

  const switchAccountVisibility = async () => {
    try {
      const result = await axios.put("/toggle-account-visibility", {
        currentUser: currentUser,
      });
      const updatedUser = result.data.updatedUser;
      dispatch(setCurrentUser(updatedUser));
    } catch (err) {
      console.log(err);
      dispatch(setErr(err));
    }
  };

  return (
    <dialog
      className="moreDialog"
      ref={dialogRef}
      onClose={() => {
        dispatch(setIsMoreDialogOpen(false));
      }}
      style={{
        height: isVisible ? "130px" : null,
        transform: isVisible ? "translateY(30%)" : null,
      }}
    >
      <div
        className="moreDialog__con"
        style={{
          transform: isVisible ? "translateX(-50%)" : null,
        }}
      >
        <ul className="moreDialog__options">
          <li className="moreDialog__option">
            <span
              className="moreDialog__hoverOverlay"
              onClick={() =>
                setSubSection({
                  isVisible: true,
                  section: "switchAccountVisibility",
                })
              }
            >
              {isPrivate ? (
                <MdPublicOff className="moreDialog__icon" />
              ) : (
                <MdPublic className="moreDialog__icon" />
              )}
              Switch account visibility
            </span>
          </li>
          <li className="moreDialog__option">
            <span
              className="moreDialog__hoverOverlay"
              onClick={() =>
                setSubSection({
                  isVisible: true,
                  section: "switchDarkTheme",
                })
              }
            >
              {isDarkTheme ? (
                <BiMoon className="moreDialog__icon" />
              ) : (
                <MdLightMode className="moreDialog__icon" />
              )}
              Switch appearance
            </span>
          </li>
          <li className="moreDialog__option">
            <span
              className="moreDialog__hoverOverlay"
              onClick={() => {
                logout();
              }}
            >
              <BiLogOut className="moreDialog__icon" />
              Log out
            </span>
          </li>
        </ul>

        {/* DARK THEME SWITCH SUB SECTION */}

        <div className="moreDialog__darkTheme">
          {/* DARK THEME HEADING */}

          <div className="moreDialog__darkTheme-heading">
            <span
              className="moreDialog__darkTheme-heading-left"
              onClick={() => setSubSection({ isVisible: false, section: "" })}
            >
              <AiFillCaretLeft className="moreDialog__icon" />
              {section === "switchDarkTheme"
                ? "Switch appearance"
                : "Account visibility"}
            </span>
            {section === "switchDarkTheme" ? (
              <span>
                {isDarkTheme ? (
                  <BiMoon className="moreDialog__icon" />
                ) : (
                  <MdLightMode className="moreDialog__icon" />
                )}
              </span>
            ) : (
              <span>
                {isPrivate ? (
                  <MdPublicOff className="moreDialog__icon" />
                ) : (
                  <MdPublic className="moreDialog__icon" />
                )}
              </span>
            )}
          </div>

          {/* DARK THEME AND PRIVATE ACCOUNT TOGGLE */}

          <div className="moreDialog__option">
            <span
              className="moreDialog__hoverOverlay"
              onClick={() => {
                if (section === "switchDarkTheme") {
                  localStorage.setItem(
                    "isDarkTheme",
                    JSON.stringify(!isDarkTheme)
                  );
                  dispatch(
                    setIsDarkTheme(
                      JSON.parse(localStorage.getItem("isDarkTheme"))
                    )
                  );
                } else {
                  switchAccountVisibility();
                }
              }}
            >
              <div className="moreDialog__darkTheme-toggle">
                <span className="moreDialog__darkTheme-toggle-title">
                  {section === "switchDarkTheme"
                    ? "Dark mode"
                    : "Private account"}
                </span>
                {section === "switchDarkTheme" ? (
                  <span
                    className="toggle"
                    style={{
                      backgroundColor: isDarkTheme ? "dodgerblue" : null,
                    }}
                  >
                    <span
                      className="toggle__switch"
                      style={{
                        right: isDarkTheme ? "2px" : null,
                        left: isDarkTheme ? null : "2px",
                      }}
                    ></span>
                  </span>
                ) : (
                  <span
                    className="toggle"
                    style={{
                      backgroundColor: isPrivate ? "dodgerblue" : null,
                    }}
                  >
                    <span
                      className="toggle__switch"
                      style={{
                        right: isPrivate ? "2px" : null,
                        left: isPrivate ? null : "2px",
                      }}
                    ></span>
                  </span>
                )}
              </div>
            </span>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default MoreDialog;
