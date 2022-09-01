const express = require("express");
const { Op } = require("sequelize");
const { Post, Comment, Image, User } = require("../models");
const { isLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const where = {};
    const lastId = parseInt(req.query.lastId);

    if (lastId) {
      where.id = { [Op.lt]: lastId };
    }

    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      include: [
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            { model: Image },
          ],
        },
        { model: User, attributes: ["id", "nickname"] },
        { model: User, as: "Likers", attributes: ["id"] },
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"] }],
        },
      ],
    });

    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
