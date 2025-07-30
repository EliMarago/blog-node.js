import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let posts = [
  { id: 1, title: "Post 1", content: "Contenuto 1" },
  { id: 2, title: "Post 2", content: "Contenuto 2" },
];
let lastId = 2;

// GET tutti i post
app.get("/posts", (req, res) => {
  res.json(posts);
});

// POST nuovo post
app.post("/posts", (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    content: req.body.content,
  };
  posts.push(newPost);
  res.json(newPost);
});

// DELETE post
app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = posts.findIndex((post) => post.id === id);

  if (index !== -1) {
    posts.splice(index, 1);
    res.json({ message: "Post eliminato" });
  } else {
    res.status(404).json({ error: "Post non trovato" });
  }
});
app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ error: "Post non trovato" });
  }
  res.json(post);
});

app.listen(port, () => {
  console.log(`📡 API server running at http://localhost:${port}`);
});
