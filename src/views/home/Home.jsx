import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axios/axios";
import { useSelector } from "react-redux";
import CreatePost from "../../components/Posts/CreatePost";

const Home = () => {
  return (
    <div>
      <CreatePost />
    </div>
  );
};

export default Home;
