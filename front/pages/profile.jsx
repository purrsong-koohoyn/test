import Head from "next/head";
import AppLayout from "../components/AppLayout";
import FollowList from "../components/FollowList";
import NicknameEditForm from "../components/NicknameEditForm";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
} from "../reducers/user";

const profile = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });
  }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me]);

  console.log(me);
  if (!me) {
    return null;
  }

  return (
    <AppLayout>
      <Head>
        <title>내 프로필 | NodeBird</title>
      </Head>
      <NicknameEditForm />
      <FollowList header="팔로잉" data={me.Followings} />
      <FollowList header="팔로워" data={me.Followers} />
    </AppLayout>
  );
};

export default profile;
