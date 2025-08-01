import express from "express";
import bodyParser from "body-parser";
import db from "./db.js";

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const postsFilePath = path.join("posts.json");

// let posts = [
//   { id: 1, title: "Post 1", content: "Contenuto 1" },
//   { id: 2, title: "Post 2", content: "Contenuto 2" },
// ];

// let lastId = 2;

// GET tutti i post
app.get("/posts", (req, res) => {
  const posts = db.prepare("SELECT * FROM posts").all();
  res.json(posts);
});

// POST nuovo post
app.post("/posts", (req, res) => {
  const { title, content } = req.body;
  const stms = db.prepare("INSERT INTO posts(title, content) VALUES (?, ?)");
  const result = stms.run(title, content);
  const newPost = { id: result.lastInsertRowid, title, content };
  res.json(newPost);

  // const newPost = {
  //   id: posts.length + 1,
  //   title: req.body.title,
  //   content: req.body.content,
  // };
  // posts.push(newPost);
  // res.json(newPost);
});

// DELETE post
app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const stms = db.prepare("SELECT * FROM posts WHERE id = ?");
  const post = stms.get(id);

  if (!post) {
    return res.status(404).json({ error: "post non trovato" });
  }

  res.json(post);
  // const index = posts.findIndex((post) => post.id === id);

  // if (index !== -1) {
  //   posts.splice(index, 1);
  //   res.json({ message: "Post eliminato" });
  // } else {
  //   res.status(404).json({ error: "Post non trovato" });
  // }
});
app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const stms = db.prepare("DELETE FROM posts WHERE id = ?");
  const result = stms.run(id);

  if (result.changes > 0) {
    res.json({ message: "Post Eliminato" });
  } else {
    res.status(404).json({ error: "Post non trovato" });
  }
  // const post = posts.find((p) => p.id === id);
  // if (!post) {
  //   return res.status(404).json({ error: "Post non trovato" });
  // }
  // res.json(post);
});

app.listen(port, () => {
  console.log(`📡 API server running at http://localhost:${port}`);
});
