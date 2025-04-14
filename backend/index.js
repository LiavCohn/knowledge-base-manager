const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "articles.json");
const getArticles = () => {
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

// get all articles
app.get("/api/articles", (req, res) => {
  const data = getArticles();
  res.json(data.articles);
});

//search by keyword
app.get("/api/articles/search", (req, res) => {
  const { keyword } = req.query;
  try {
    const data = getArticles();

    const filtered = data.articles.filter((article) => {
      const lowerKeyword = keyword?.toLowerCase();
      return (
        article.title?.toLowerCase().includes(lowerKeyword) ||
        article.content?.toLowerCase().includes(lowerKeyword) ||
        (Array.isArray(article.tags) &&
          article.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword)))
      );
    });
    res.status(200).json(filtered);
  } catch (e) {
    console.error("Search failed:", e, req);
    res.status(500).json({ error: "Failed to perform search" });
  }
});

// get article by Id
app.get("/api/articles/:id", (req, res) => {
  const { id } = req.params;
  const data = getArticles();
  const article = data.articles.find((a) => a.id === id);
  res.json(article);
});

// create article
app.post("/api/articles", (req, res) => {
  const data = getArticles();
  const newArticle = req.body;
  data.articles.push(newArticle);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(201).json(newArticle);
});

// update article
app.put("/api/articles/:id", (req, res) => {
  const { id } = req.params;
  const data = getArticles();
  const index = data.articles.findIndex((a) => a.id === id);
  data.articles[index] = { ...data.articles[index], ...req.body };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json(data.articles[index]);
});

// delete article
app.delete("/api/articles/:id", (req, res) => {
  const { id } = req.params;
  let data = getArticles();
  data.articles = data.articles.filter((a) => a.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(204).send();
});

const PORT = 3001;
app.listen(PORT);
