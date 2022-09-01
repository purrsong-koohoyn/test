const express = require("express");
const { User, Post } = require("../models");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });

      res.status(200).json(user);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디 입니다.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });

    return res.status(201).send("ok");
  } catch (error) {
    console.error(error);

    next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      console.error(error);
      next(error);
    }

    if (info) {
      return res.status(401).send(info.reason);
    }

    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }

      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id", "nickname"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id", "nickname"],
          },
        ],
      });
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logOut(() => {
    req.session.destroy();
  });
  res.send("ok");
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );

    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followers", isLoggedIn, async (req, res, next) => {
  try {
    const followers = await User.getFollowers({ where: { id: req.user.id } });

    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  try {
    const followings = await User.getFollowers({ where: { id: req.user.id } });

    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    console.log(1111, req.params.userId, req.user.id);
    const user = await User.findOne({ where: { id: req.params.userId } });

    if (!user) {
      res.status(403).send("알수 없는 유저 팔로우");
    }

    await user.addFollowers(req.user.id);

    res.status(200).json({ userId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });

    if (!user) {
      res.status(403).send("알수 없는 유저 언팔로우");
    }

    await user.removeFollowers(req.user.id);

    res.status(200).json({ userId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
    });

    if (!user) {
      res.status(403).send("알수 없는 유저 차단");
    }

    await user.removeFollowings(req.user.id);

    res.status(200).json({ userId: parseInt(req.params.userId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
