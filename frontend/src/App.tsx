import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import NewsList from './components/NewsList';
import AddPost from './components/AddPost';

const App: React.FC = () => {
  return (
    <div className="container mt-4">
      <nav className="mb-4">
        <Link to="/" className="btn btn-primary me-2">News</Link>
        <Link to="/post" className="btn btn-success">Add New Post</Link>
      </nav>
      <Routes>
        <Route path="/" element={<NewsList />} />
        <Route path="/post" element={<AddPost />} />
      </Routes>
    </div>
  );
};

export default App;

