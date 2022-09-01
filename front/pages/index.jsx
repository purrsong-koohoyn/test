import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import React, { useEffect } from "react";
import { LOAD_POST_REQUEST } from "../reducers/post";
import { LOAD_USER_REQUEST } from "../reducers/user";

const Home = () => {
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostLoading, retweetError } =
    useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST,
    });
    dispatch({
      type: LOAD_POST_REQUEST,
    });
  }, []);

  useEffect(() => {
    function onScroll() {
      if (
        Math.round(window.scrollY) + document.documentElement.clientHeight >
          document.documentElement.scrollHeight - 300 &&
        hasMorePosts &&
        !loadPostLoading
      ) {
        const lastId = mainPosts[mainPosts.length - 1]?.id;
        dispatch({
          type: LOAD_POST_REQUEST,
          lastId,
        });
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePosts, loadPostLoading, mainPosts]);

  return (
    <AppLayout>
      {isLoggedIn && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export default Home;
