import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNews, deleteNews, fetchFullPost } from '../store/newsSlice';
import { RootState, AppDispatch } from '../store/store';

const NewsList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { news, loading, error, fullPost } = useSelector((state: RootState) => state.news);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteNews(id));
  };

  const handleReadFullPost = (id: number) => {
    dispatch(fetchFullPost(id));
  };

  return (
    <div className="container">
      <h2>News</h2>
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="list-group">
        {news.map((item) => (
          <div key={item.id} className="list-group-item">
            {item.image && <img src={item.image} alt={item.title} className="img-fluid mb-2" style={{ maxHeight: '200px' }} />}
            <h5>{item.title}</h5>
            <p>{item.content}</p>
            <button className="btn btn-danger me-2" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
            <button className="btn btn-primary" onClick={() => handleReadFullPost(item.id)}>
              Read Full Post
            </button>
          </div>
        ))}
      </div>
      {fullPost && (
        <div className="mt-4 p-4 border rounded">
          {fullPost.image && <img src={fullPost.image} alt={fullPost.title} className="img-fluid mb-2" />}
          <h3>{fullPost.title}</h3>
          <p>{fullPost.content}</p>
        </div>
      )}
    </div>
  );
};

export default NewsList;