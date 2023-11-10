import { useEffect, useRef, useState } from "react";
import axios from "../../axios/axios";
import SearchResult from "./SearchResult";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllUsers,
  setCurrentUser,
  setIsSearchbarVisible,
} from "../../store/reducers/User/userReducer";
import { setErr } from "../../store/reducers/Error/errReducer";
import { useNavigate } from "react-router-dom";

const Searchbar = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { searchHistory } = currentUser;

  const isSearchbarVisible = useSelector(
    (state) => state.user.isSearchbarVisible
  );
  const searchBtnRef = useSelector((state) => state.user.searchBtnRef);
  const allUsers = useSelector((state) => state.user.allUsers);

  const [searchVal, setSearchVal] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchbarRef = useRef();

  const handleClickOutside = (e) => {
    if (searchBtnRef) {
      if (
        searchbarRef.current.contains(e.target) ||
        searchBtnRef.contains(e.target)
      )
        return;
    }

    dispatch(setIsSearchbarVisible(false));
  };

  const getAllUsers = async () => {
    try {
      const result = await axios.get("/allUsers");
      const allUsers = result.data.allUsers;
      dispatch(setAllUsers(allUsers));
    } catch (err) {
      console.log(err);
      dispatch(setErr(err.response.data));
    }
  };

  const updateUserSearchHistory = async (userToAddId, username) => {
    dispatch(setIsSearchbarVisible(false));
    setSearchVal("");
    navigate(`/${username}`);
    try {
      const result = await axios.put("/update-history", {
        userId: userToAddId,
      });
      const updatedHistory = result.data.updatedHistory;
      dispatch(
        setCurrentUser({
          ...currentUser,
          searchHistory: updatedHistory.reverse(),
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(setErr(err.response.data));
    }
  };

  const clearEntireHistory = async () => {
    try {
      await axios.put("/update-history", {
        actionType: "removeAll",
      });
      dispatch(setCurrentUser({ ...currentUser, searchHistory: [] }));
    } catch (err) {
      console.log(err);
      dispatch(setErr(err.response.data));
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isSearchbarVisible]);

  return (
    <div
      className="searchbar"
      style={{
        transform: isSearchbarVisible ? "translateX(0)" : null,
      }}
      ref={searchbarRef}
    >
      <div className="searchbar__con">
        <div className="searchbar__upper">
          <h3 className="searchbar__header">Search</h3>
          <input
            type="text"
            placeholder="Search"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
        <div className="searchbar__lower">
          {!searchVal && (
            <div className="searchbar__recent">
              <span>Recent</span>
              {searchHistory.length > 0 && (
                <button
                  onClick={() => {
                    clearEntireHistory();
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
          )}
          <div className="searchbar__results">
            {!searchVal && !searchHistory.length && (
              <div className="searchbar__noRecent">No recent searches</div>
            )}
            {searchVal &&
              allUsers.map((user) => {
                if (
                  user.username.toLowerCase().includes(searchVal.toLowerCase())
                ) {
                  return (
                    <div
                      key={user._id}
                      onClick={() => {
                        updateUserSearchHistory(user._id, user.username);
                      }}
                    >
                      {" "}
                      <SearchResult user={user} searchVal={searchVal} />
                    </div>
                  );
                } else {
                }
              })}
            {!searchVal &&
              searchHistory.map((result) => {
                return (
                  <SearchResult
                    user={result}
                    key={result._id}
                    searchVal={searchVal}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
