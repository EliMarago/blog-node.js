import express from "express";
import bodyParser from "body-parser";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let posts = [
  { id: 1, title: "Primo Post", content: "Questo è il primo post" },
  { id: 2, title: "Secondo Post", content: "Altro contenuto interessante" },
];

//rotta principale
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts`);
    res.render("index", { posts: response.data });
  } catch (error) {
    res.status(500).send("Errore nel recupero dei post");
  }
});
app.get("/posts/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${req.params.id}`);
    res.render("Post", { post: response.data });
  } catch (error) {
    res.status(404).send("Post non trovato");
  }
});
//form nuovo post
app.get("/new", (req, res) => {
  res.render("new.ejs", { heading: "new post", sumbit: "Create post" });
});
app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, req.body);
    res.redirect("/?success=Post creato con successo");
  } catch (error) {
    res.status(500).json({ message: "Errore nella creazione del post" });
  }
});
//crea post
app.post("/posts", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    content: req.body.content,
  };
  posts.push(newPost);
  res.redirect("/");
});
app.post("/api/posts/delete/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    await axios.delete(`${API_URL}/posts/${postId}`);
    res.redirect("/?success=Post eliminato con successo");
  } catch (error) {
    console.error("Errore cancellazione post", error.message);
    res.status(500).send("Errore nella cancellazione del post");
  }
});
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
