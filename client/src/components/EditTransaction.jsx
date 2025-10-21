import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;

function EditTransaction({ transactionId, onUpdate }) {
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState('');
  const [updatedTransaction, setUpdatedTransaction] = useState({});

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const token = localStorage.getItem('token');

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        console.log("Fetching transaction with ID:", transactionId); // Логирование ID
        const response = await axios.get(`${API_URL}/api/transaction/${transactionId}`, config);
        setTransaction(response.data);
        setUpdatedTransaction(response.data); // Инициализируем данные для редактирования
      } catch (error) {
        console.error('Ошибка при загрузке транзакции:', error);
        setError('Ошибка при загрузке транзакции');
      }
    };

    if (transactionId) {
      fetchTransaction();
    } else {
      setError('ID транзакции отсутствует');
    }
  }, [transactionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTransaction((prev) => ({ ...prev, [name]: value })); // Обновляем данные для редактирования
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    try {
      const token = localStorage.getItem('token');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`${API_URL}/api/transaction/${transactionId}`, updatedTransaction, config);
      onUpdate(); // Обновляем родительский компонент
    } catch (error) {
      console.error('Ошибка при обновлении транзакции:', error);
      setError('Ошибка при обновлении транзакции');
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!transaction) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 3, boxShadow: 2, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Редактировать транзакцию</Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            label="Сумма счета"
            type="number"
            name="amountBilled"
            fullWidth
            value={updatedTransaction.amountBilled || ''}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Оплачено"
            type="number"
            name="amountPaid"
            fullWidth
            value={updatedTransaction.amountPaid || ''}
            onChange={handleChange}
            required
          />
        </Box>
        {/* Добавьте другие поля формы по мере необходимости */}
        <Button variant="contained" color="primary" type="submit" fullWidth>
          Сохранить изменения
        </Button>
      </form>
    </Box>
  );
}

export default EditTransaction;
