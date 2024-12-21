import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box, Container } from '@mui/material';

const Home = ({isAuthenticated}) => {
  return (
    <Container>
    <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginTop: 2,
        maxWidth: 400,
        margin: '0 auto',
        gap: 2
      }}>
        
        <Button variant="contained" color="primary" component={Link} to="/register">
          Регистрация
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/login">
          Авторизация
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/posts">
          Заметки
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/transactions">
          ТНС
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/tgks">
          ТГК
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/waters">
          Водоканал
        </Button>
    </Box>
    </Container>
  );
};

export default Home;
