import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL

const AddWater = ({ isAuthenticated }) => {
  const [amountBilled, setAmountBilled] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Преобразование строк в числа
    const billed = Number(amountBilled);
    const paid = Number(amountPaid);

    // Проверка на валидность чисел
    if (isNaN(billed) || isNaN(paid)) {
      alert('Пожалуйста, введите корректные числовые значения.');
      return;
    }

    const transaction = { amountBilled: billed, amountPaid: paid };

    try {
      await axios.post(`${API_URL}/api/water`, transaction, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSuccess('Транзакция успешно добавлена');
      setAmountBilled('');
      setAmountPaid('');
    } catch (err) {
      setError(err.response ? err.response.data.msg : 'Что-то пошло не так!');
    }
  };

  return (
        <Box
          sx={{
            maxWidth: 400,
            margin: '0 auto',
            padding: 3,
            boxShadow: 2,
            borderRadius: 2,
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Добавить транзакцию
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                label="В настоящий момент начислено (руб.)"
                type="number"
                name="amountBilled"
                fullWidth
                value={amountBilled}
                onChange={(e) => setAmountBilled(e.target.value)}
                required
                inputProps={{ min: "0", step: "0.01" }}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="В настоящий момент оплачено (руб.)"
                type="number"
                name="amountPaid"
                fullWidth
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                required
                inputProps={{ min: "0", step: "0.01" }}
              />
            </Box>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Добавить транзакцию
            </Button>
          </form>
          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success" mt={2}>
              {success}
            </Typography>
          )}
        </Box>
  );
};

export default AddWater;
