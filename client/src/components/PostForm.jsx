import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams} from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PostForm = (isAuthenticated) => {
  const [title, setTitle] = useState([]);
  const [content, setContent] = useState([]);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/posts/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setTitle(Array.isArray(res.data.title) ? res.data.title : []);
          setContent(Array.isArray(res.data.content) ? res.data.title : []);
        } catch (err) {
          console.error('Error fetching post:', err);
          setError(err.response ? err.response.data.msg : 'Something went wrong');
          setTitle([]);
          setContent([]);
        }
      };

      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = { title, content };

    try {
      if (id) {
        // Обновление поста
        await axios.put(`${API_URL}/api/posts/${id}`, postData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        // Создание нового поста
        await axios.post(`${API_URL}/api/posts`, postData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }

      navigate('/posts');
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err.response ? err.response.data.msg : 'Something went wrong');
    }
  };

  return (
    isAuthenticated && (  
    <>
      <Box sx={{ maxWidth: 600, margin: 'auto', padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          {id ? 'Редактировать' : 'Создать'}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Content"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            sx={{ marginBottom: 2 }}
          />
          <Button type="submit" variant="contained" color="primary">
            {id ? 'Обновить' : 'Создать'}
          </Button>
        </form>
      </Box>
    </>)
  );
};

export default PostForm;
