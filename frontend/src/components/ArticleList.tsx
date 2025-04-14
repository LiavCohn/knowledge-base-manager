import { Article } from '../types';

type Props = {
  articles: Article[];
  onDelete: (id: string) => void;
  onEdit: (article: Article) => void;
};

const ArticleList = ({ articles, onDelete, onEdit }: Props) =>{
  return (
    <div className="article-list">
      {articles.length ? articles.map((a) => (
        <div key={a.id} className="article">
          <h3>{a.title || 'Untitled'}</h3>
          <p>{a.content || 'No content available.'}</p>
          <small>Tags: {Array.isArray(a.tags) ? a.tags.join(', ') : a.tags}</small>
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => onEdit(a)}>Edit</button>
            <button onClick={() => onDelete(a.id)} style={{ marginLeft: '10px', background: 'crimson' }}>Delete</button>
          </div>
        </div>
      )) : <p>No articles found.</p>}
    </div>
  );
}


export default ArticleList;
