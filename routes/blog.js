const express = require("express");
const { render } = require("express/lib/response");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/posts", async function (req, res) {
  const query = `SELECT post.*, author.name AS author_name FROM post INNER JOIN author ON post.author_id = author.id`;
  const [posts] = await db.query(query);
  res.render("posts-list", { posts: posts });
});

router.get("/new-post", async function (req, res) {
  const [authors] = await db.query("SELECT * FROM author");
  // this code will be executed after resolve async/await
  res.render("create-post", { authors: authors });
});

router.post("/posts", async function (req, res) {
  const data = [
    req.body.title, // these are the name in our form in HTML
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  await db.query(
    "INSERT INTO post(title, summary, body, author_id) VALUES (?)",
    [data]
  );
  res.redirect("/posts");
});
//view detail
router.get("/posts/:id", async function (req, res) {
  const urlID = req.params.id;
  const [post] = await db.query(
    "SELECT post.*, author.name, author.email FROM post INNER JOIN author ON post.author_id = author.id WHERE post.id = ?",
    [urlID]
  );
  //post is array even though we have only one value
  const postData = {
    ...post[0],
    date: post[0].date.toISOString(),
    humanReadableDate: post[0].date.toLocaleDateString("en-US", {
      weekdate: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  if (!post || post.length === 0) return res.status(404).render("404");

  res.render("post-detail", { post: postData });
});
//edit
router.get("/posts/:id/edit", async function (req, res) {
  const query = `SELECT * FROM post WHERE id = ?`;
  const [posts] = await db.query(query, [req.params.id]);
  res.render("update-post", { post: posts[0] });
});

router.post("/posts/:id/edit", async function (req, res) {
  const query = `UPDATE post SET title = ?, summary = ?, body = ?
    WHERE id = ?`;
  await db.query(query, [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.params.id,
  ]);
  res.redirect("/posts");
});

router.post("/posts/:id/delete", async function (req, res){
    const query = `DELETE FROM post WHERE id = ?`;
    await db.query(query,[req.params.id])
    res.redirect("/posts");
})

module.exports = router;
