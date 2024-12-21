// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import { Box, TextField, Button, Typography, Alert } from '@mui/material';

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// const AuthForm = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isRegister, setIsRegister] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = isRegister
//         ? await axios.post(`${API_URL}/api/users/register`, { username, email, password })
//         : await axios.post(`${API_URL}/api/users/login`, { email, password });

//       localStorage.setItem('token', response.data.token);
//       navigate('/posts');
//     } catch (err) {
//       setError(err.response ? err.response.data.msg : 'Something went wrong');
//     }
//   };

//   return (
//     <>
//       <Box sx={{
//         display: 'flex',
//         justifyContent: 'space-betweem',
//         flexDirection: 'column',
//         marginTop: 2,
//         maxWidth: 400,
//         margin: '0 auto',
//         gap: 2
//       }}>
//         <Button component={Link} variant="contained" to="/" color="primary">
//           Главная
//         </Button>
//         <Button
//           component={Link}
//           to={isRegister ? '/login' : '/register'}  // Условная ссылка на страницу
//           variant="contained"
//           color="primary"
//           onClick={() => setIsRegister(!isRegister)}  // Переключение состояния при клике
//         >
//           {isRegister ? 'Авторизация' : 'Регистрация'}
//         </Button>
        
//         <Button component={Link} variant="contained" to="/posts" color="primary">
//           Заметки
//         </Button>
//         <Button component={Link} variant="contained" to="/transactions" color="primary">
//           ТНС
//         </Button>
//         <Button component={Link} variant="contained" to="/tgks" color="primary">
//           ТГК
//         </Button>
//         <Button component={Link} variant="contained" to="/waters" color="primary">
//           Водоканал
//         </Button>
//       </Box>
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           gap: 2,
//           maxWidth: 400,
//           margin: '0 auto',
//           padding: 2,
//         }}
//       >
//         <Typography variant="h4" align="center">
//           {isRegister ? 'Регистрация' : 'Авторизация'}
//         </Typography>

//         {isRegister && (
//           <TextField
//             label="Username"
//             variant="outlined"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             fullWidth
//           />
//         )}

//         <TextField
//           label="Email"
//           type="email"
//           variant="outlined"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           fullWidth
//           required
//         />

//         <TextField
//           label="Password"
//           type="password"
//           variant="outlined"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           fullWidth
//           required
//         />

//         <Button variant="contained" color="primary" type="submit" fullWidth>
//           {isRegister ? 'Регистрация' : 'Авторизация'}
//         </Button>

//         {error && (
//           <Alert severity="error">
//             {error}
//           </Alert>
//         )}
//       </Box>
//     </>
//   );
// };

// export default AuthForm;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false); // Default is false (login)
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Определяем, какая форма должна отображаться на основе маршрута
  useEffect(() => {
    setIsRegister(location.pathname === '/register');
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = isRegister
        ? await axios.post(`${API_URL}/api/users/register`, { username, email, password })
        : await axios.post(`${API_URL}/api/users/login`, { email, password });

      localStorage.setItem('token', response.data.token);
      navigate('/posts');
    } catch (err) {
      setError(err.response ? err.response.data.msg : 'Something went wrong');
    }
  };

  return (
    <>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginTop: 2,
        maxWidth: 400,
        margin: '0 auto',
        gap: 2
      }}>
        <Button component={Link} variant="contained" to="/" color="primary">
          Главная
        </Button>
        <Button
          component={Link}
          to={isRegister ? '/login' : '/register'} // Условная ссылка на страницу
          variant="contained"
          color="primary"
        >
          {isRegister ? 'Авторизация' : 'Регистрация'}
        </Button>
        <Button component={Link} variant="contained" to="/posts" color="primary">
          Заметки
        </Button>
        <Button component={Link} variant="contained" to="/transactions" color="primary">
          ТНС
        </Button>
        <Button component={Link} variant="contained" to="/tgks" color="primary">
          ТГК
        </Button>
        <Button component={Link} variant="contained" to="/waters" color="primary">
          Водоканал
        </Button>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          margin: '0 auto',
          padding: 2,
        }}
      >
        <Typography variant="h4" align="center">
          {isRegister ? 'Регистрация' : 'Авторизация'}
        </Typography>

        {isRegister && (
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />
        )}

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />

        <Button variant="contained" color="primary" type="submit" fullWidth>
          {isRegister ? 'Регистрация' : 'Авторизация'}
        </Button>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}
      </Box>
    </>
  );
};

export default AuthForm;
