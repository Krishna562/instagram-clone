import { BiMoon, BiLogOut } from "react-icons/bi";
import { MdLightMode } from "react-icons/md";
import { AiFillCaretLeft } from "react-icons/ai";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsMoreDialogOpen,
  setIsDarkTheme,
} from "../../store/reducers/More/moreReducer";
import axios from "../../axios/axios";
import { useNavigate } from "react-router-dom";
import { checkAuthStatus } from "../../store/reducers/User/userReducer";

const MoreDialog = () => {
  const isMoreDialogOpen = useSelector((state) => state.more.isMoreDialogOpen);
  const isDarkTheme = useSelector((state) => state.more.isDarkTheme);

  const [isSwitchingAppearance, setIsSwitchingAppearance] = useState(false);

  const dispatch = useDispatch();

  const dialogRef = useRef();

  useEffect(() => {
    if (isMoreDialogOpen) {
      dialogRef.current.show();
    } else {
      dialogRef.current.close();
      setIsSwitchingAppearance(false);
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

  return (
    <dialog
      className="moreDialog"
      ref={dialogRef}
      onClose={() => {
        dispatch(setIsMoreDialogOpen(false));
      }}
    >
      <div
        className="moreDialog__con"
        style={{
          transform: isSwitchingAppearance ? "translateX(-50%)" : null,
        }}
      >
        <ul className="moreDialog__options">
          <li className="moreDialog__option">
            <span
              className="moreDialog__hoverOverlay"
              onClick={() => setIsSwitchingAppearance(true)}
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
              onClick={() => setIsSwitchingAppearance(false)}
            >
              <AiFillCaretLeft className="moreDialog__icon" />
              Switch appearance
            </span>
            {isDarkTheme ? (
              <BiMoon className="moreDialog__icon" />
            ) : (
              <MdLightMode className="moreDialog__icon" />
            )}
          </div>

          {/* DARK THEME TOGGLE */}

          <div className="moreDialog__option">
            <span
              className="moreDialog__hoverOverlay"
              onClick={() => dispatch(setIsDarkTheme(!isDarkTheme))}
            >
              <div className="moreDialog__darkTheme-toggle">
                <span className="moreDialog__darkTheme-toggle-title">
                  Dark mode
                </span>
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
              </div>
            </span>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default MoreDialog;
