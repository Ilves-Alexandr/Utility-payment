import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  Container,
} from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;

const PostList = ({ isAuthenticated }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/posts`);
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response ? err.response.data.msg : 'Something went wrong');
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      setError(err.response ? err.response.data.msg : 'Something went wrong');
    }
  };

  return (
    <Container>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-betweem',
        flexDirection: 'column',
        marginTop: 2,
        maxWidth: 400,
        margin: '0 auto',
        gap: 2
      }}>
        <Button component={Link} to="/" variant="contained" color="primary">
          Главная
        </Button>
        <Button component={Link} to={!isAuthenticated ? "/login" : "/register"} variant="contained" color="primary">
          {!isAuthenticated ? 'Авторизация' : 'Регистрация'}
        </Button>
        <Button component={Link} to="/transactions" variant="contained" color="primary">
          ТНС
        </Button>
        <Button component={Link} to="/tgks" variant="contained" color="primary">
          ТГК
        </Button>
        <Button component={Link} to="/waters" variant="contained" color="primary">
          Водоканал
        </Button>
      </Box>
      <Typography variant="h4" gutterBottom>
        Заметки
      </Typography>

      {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
      <Box sx={{ marginBottom: 2 }}>
        <Link to="/create">
          <Button variant="contained" color="primary">Создать заметку</Button>
        </Link>
      </Box>

      <List>
        {Array.isArray(posts) && posts.map((post) => (
          <ListItem key={post._id} sx={{ marginBottom: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
            <Card variant="outlined" sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body2" color="textSecondary">{post.content}</Typography>
                <Typography variant="caption" color="textSecondary">
                  <strong>Создано:</strong> {new Date(Date.parse(post.createdAt)).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  <strong>Отредактировано:</strong> {new Date(Date.parse(post.updatedAt)).toLocaleString()}
                </Typography>
                <Box sx={{ marginTop: 2 }}>
                  <Link to={`/edit/${post._id}`}>
                    <Button variant="outlined" color="primary" sx={{ marginRight: 1 }}>
                      Редактировать
                    </Button>
                  </Link>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(post._id)}>
                    Удалить
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default PostList;
