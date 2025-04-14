import { useEffect, useState } from 'react';
import { Article } from './types';

import './styles/App.css';
import ArticleList from './components/ArticleList';
import ArticleForm from './components/ArticleForm';



function App() {
  const URL = 'http://localhost:3001/api/articles'
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetch(URL)
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.error(err));
  }, []);

  const handleSearch = async () => {
    try {
      const res = await fetch(`${URL}/search?keyword=${search.trim()}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Search failed");
      }
      const json = await res.json();
      setArticles(json);
    } catch (error) {
      console.error("Search error:", error);
      alert("Something went wrong with your search...");
    }
  };

  const handleAdd = async (article: Article) => {
    try {
      const res = await fetch(`${URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
      })
      const newArticle = await res.json()
      setArticles([...articles,newArticle])
      
    } catch (error) {
      console.log({ error })
      alert("Failed to create article")
    }
  };

  const handleDelete = async (id: string) => {
    
    try {
      const res = await fetch(`${URL}/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setArticles(prev => prev.filter(article => article.id !== id));

      }
      
    } catch (error) {
      console.log({ error })
      alert("Failed to remove article");
    }

  };

  const handleUpdate = (article: Article) => {
    fetch(`${URL}/${article.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    })
      .then(res => res.json())
      .then(updated => {
        setArticles(prev => prev.map(a => (a.id === updated.id ? updated : a)));
      })
      .catch(err => console.error(err));
  };

  const handleClear = async () => {
    try {
      setSearch('')
      const articles = await (await fetch(URL)).json()
      setArticles(articles)
    } catch (error) {
      console.log({ error })
      alert("Failed to reset search.")
    }
  }

  return (
    <div className="container">
      <h1>📚 Knowledge Base</h1>
      <div className="search">
        <input
          placeholder="Search by keyword or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
         <button className='clear' onClick={handleClear}>Clear</button>
        <button onClick={handleSearch}>Search</button>
      </div>

      <ArticleForm
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editingArticle={editingArticle}
        clearEdit={() => setEditingArticle(null)}
      />

      <ArticleList
        articles={articles}
        onDelete={handleDelete}
        onEdit={setEditingArticle}
      />
    </div>
  );
}

export default App;
