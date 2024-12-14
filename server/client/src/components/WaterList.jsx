import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography, List, ListItem, Divider, Container, Box } from '@mui/material';
import WaterItem from './WaterItem';
import EditWater from './EditWater';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const WaterList = ({ isAuthenticated }) => {
  const [transactions, setTransactions] = useState([]);
  const [totalAmountBilled, setTotalAmountBilled] = useState(0);
  const [userDebts, setUserDebts] = useState([]);
  const [userBalances, setUserBalances] = useState([]);
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [error, setError] = useState('');

  const fetchWaters = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/waters`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTransactions(res.data.transactions);
      setTotalAmountBilled(res.data.totalAmountBilled); //res.data.totalAmountBilled[0]?.total || 0
      setUserDebts(res.data.userDebts);
      setUserBalances(res.data.userBalances);
    } catch (err) {
      setError(err.response ? err.response.data.msg : 'Something went wrong');
    }
  };

  useEffect(() => {
    fetchWaters();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/water/${id}`, {
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
    await fetchWaters();
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
        <Button component={Link} to="/tgks" variant="contained" color="primary">ТГК</Button>
      </Box>
      <Typography variant="h4" gutterBottom>Водоканал</Typography>

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
        {transactions.map((transaction) => (
          <ListItem key={transaction._id}>
            <Typography>ID транзакции: {transaction._id}</Typography>
            <Typography>Пользователь: {transaction.user.username}</Typography>
            <Typography>Начислено: {transaction.amountBilled}</Typography>
            <Typography>Оплачено: {transaction.amountPaid}</Typography>
            <Typography>Дата и Время: {new Date(transaction.date).toLocaleString()}</Typography>

            <WaterItem transaction={transaction} onDelete={() => handleDelete(transaction._id)} />

            <Button variant="outlined" color="secondary" onClick={() => handleEditClick(transaction._id)}>
              Редактировать
            </Button>
          </ListItem>
        ))}

        {editingTransactionId && (
          <EditWater transactionId={editingTransactionId} onUpdate={handleUpdate} />
        )}
      </List>

      {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
};

export default WaterList;
