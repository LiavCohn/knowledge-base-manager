import { useState, useEffect } from 'react';
import { Article } from '../types';

type Props = {
  onAdd: (article: Article) => void;
  onUpdate: (article: Article) => void;
  editingArticle?: Article | null;
  clearEdit: () => void;
};

const ArticleForm = ({ onAdd, onUpdate, editingArticle, clearEdit }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title);
      setContent(editingArticle.content);
      setTags(editingArticle.tags.join(', '));
    }
  }, [editingArticle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim());
    const article = {
      id: editingArticle ? editingArticle.id : `A${Date.now()}`, //get new id or use the existing one
      title,
      content,
      tags: tagsArray
    };

    if (editingArticle) {
      onUpdate(article);
    } else {
      onAdd(article);
    }

      clearForm()
    };
    
    const clearForm = () => {    
        setTitle('');
        setContent('');
        setTags('');
        clearEdit(); //clear the selected article as well
    }

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>{editingArticle ? 'Edit Article' : 'Add Article'}</h2>
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
          <input placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
          <div className='button-container'>
                <button type="submit">{editingArticle ? 'Update' : 'Add'}</button>
                {editingArticle && <button type="button" onClick={clearForm} style={{ marginLeft: '5px' }} className='clear'>Cancel</button>}
              
          </div>
    </form>
  );
}

export default ArticleForm;
