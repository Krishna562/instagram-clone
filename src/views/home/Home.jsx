import { useEffect, useState } from "react";
import axios from "../../axios/axios";
import { useSelector, useDispatch } from "react-redux";
import CreatePost from "../../components/Posts/CreatePost";
import { setAllPosts } from "../../store/reducers/Post/postReducer";
import { setErr } from "../../store/reducers/Error/errReducer";
import Post from "./Post";

const Home = () => {
  const dispatch = useDispatch();
  const allPosts = useSelector((state) => state.post.allPosts);

  const getAllPosts = async () => {
    try {
      const result = await axios.get("/all-posts");
      const allPosts = result.data.allPosts;
      dispatch(setAllPosts(allPosts));
    } catch (err) {
      dispatch(setErr(err.response.data));
    } finally {
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <section className="home">
      <CreatePost />
      <div className="home__postsCon">
        {allPosts.map((post) => {
          return <Post post={post} key={post._id} />;
        })}
      </div>
    </section>
  );
};

export default Home;
