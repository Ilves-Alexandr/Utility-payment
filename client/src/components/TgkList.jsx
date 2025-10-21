import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TgkItem from './TgkItem';
import EditTgk from './EditTgk';
import { Button, Typography, List, ListItem, Divider, Container, Box } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;

const TgkList = ({ isAuthenticated }) => {
  const [transactions, setTransactions] = useState([]);
  const [totalAmountBilled, setTotalAmountBilled] = useState(0);
  const [userDebts, setUserDebts] = useState([]);
  const [userBalances, setUserBalances] = useState([]);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [error, setError] = useState('');

  const fetchTgks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tgks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactions(Array.isArray(res.data.transactions) ? res.data.transactions : []);
      setTotalAmountBilled(res.data.totalAmountBilled || 0);
      setUserDebts(Array.isArray(res.data.userDebts) ? res.data.userDebts : []);
      setUserBalances(Array.isArray(res.data.userBalances) ? res.data.userBalances : []);
      console.log('API Response:', res.data);
      console.log('Transactions:', res.data.transactions);
    } catch (err) {
      setError(err.response ? err.response.data.msg : 'Something went wrong');
      setTransactions([]);
    }
  };

  useEffect(() => {
    fetchTgks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/tgk/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactions(transactions.filter(transaction => transaction._id !== id));
    } catch (error) {
      setError('Ошибка при удалении транзакции');
    }
  };

  const handleEditClick = (id) => {
    setEditingTransactionId(id);
  };

  const handleUpdate = async () => {
    await fetchTgks();
    setEditingTransactionId(null);
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
        <Button component={Link} to="/" variant="contained" color="primary">Главная</Button>
        <Button component={Link} to={!isAuthenticated ? "/login" : "/register"} variant="contained" color="primary">
          {!isAuthenticated ? 'Авторизация' : 'Регистрация'}
        </Button>
            <Button component={Link} to="/posts" variant="contained" color="primary">Заметки</Button>
            <Button component={Link} to="/transactions" variant="contained" color="primary">ТНС</Button>
            <Button component={Link} to="/waters" variant="contained" color="primary">Водоканал</Button>
      </Box>
          <Typography variant="h4" gutterBottom>ТГК</Typography>
          <Box mb={3}>
            <Typography variant="h6">Общая сумма начисленных средств: {totalAmountBilled}</Typography>
          </Box>
          <Box mb={3}>
            <Typography variant="h6">Сальдо пользователей</Typography>
            <List>
              {userBalances.map((balance, index) => (
                <ListItem key={index}>
                  <Typography>Пользователь: {balance.user}, Сальдо: {balance.balance}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box mb={3}>
            <Typography variant="h6">Задолженности пользователей</Typography>
            <List>
              {userDebts.map((debt, index) => (
                <ListItem key={index}>
                  <Typography>Пользователь: {debt.user}, Долг: {debt.debt}, Оплачено: {debt.totalPaid}</Typography>
                  <Divider />
                </ListItem>
              ))}
            </List>
          </Box>
          <Divider />
          <List>
            {Array.isArray(transactions) && transactions.map((transaction) => (
              <ListItem key={transaction._id}>
                <Typography>ID транзакции: {transaction._id}</Typography>
                <Typography>Пользователь: {transaction.user.username}</Typography>
                <Typography>Начислено: {transaction.amountBilled}</Typography>
                <Typography>Оплачено: {transaction.amountPaid}</Typography>
                <Typography>Дата и Время: {new Date(transaction.date).toLocaleString()}</Typography>
                <TgkItem transaction={transaction} onDelete={() => handleDelete(transaction._id)} />
                <Button variant="outlined" color="secondary" onClick={() => handleEditClick(transaction._id)}>
                  Редактировать
                </Button>
              </ListItem>
            ))}

            {editingTransactionId && (
              <EditTgk transactionId={editingTransactionId} onUpdate={handleUpdate} />
            )}
          </List>
          {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
};

export default TgkList;
