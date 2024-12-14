import React, { useState } from 'react';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function TransactionItem({ transaction, onDelete }) {
  const [open, setOpen] = useState(false); // Состояние для управления диалогом

  // Открыть диалог
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Закрыть диалог
  const handleClose = () => {
    setOpen(false);
  };

  // Подтверждение удаления
  const handleConfirmDelete = () => {
    onDelete(); // Вызов функции удаления
    setOpen(false); // Закрыть диалог после удаления
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
      <Button variant="contained" color="error" onClick={handleClickOpen}>
        Удалить
      </Button>

      {/* Диалог подтверждения */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы уверены, что хотите удалить эту транзакцию? Это действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TransactionItem;
