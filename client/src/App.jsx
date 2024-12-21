import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import EditTransaction from './components/EditTransaction';
import AddTgk from './components/AddTgk';
import TgkList from './components/TgkList';
import EditTgk from './components/EditTgk';
import Home from './components/Home';
import WaterList from './components/WaterList';
import AddWater from './components/AddWater';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<AuthForm /*isRegister={true} */ />} />
        <Route path="/login" element={<AuthForm /*isRegister={false}*/ />} />
        <Route path="/transactions" element={<><TransactionList/><AddTransaction /></>} />
        <Route path="/tgks" element={<><TgkList/><AddTgk /></>} />
        <Route path="/waters" element={<><WaterList/><AddWater /></>} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/create" element={<><PostForm /><PostList /></>} />
        <Route path="/edit/:id" element={<><PostForm /><PostList /></>} />
        <Route path="/delete/:id" element={<><PostForm /><PostList /></>} />
        <Route path="/edit-transaction/:id" component={EditTransaction} />
        <Route path="/edit-tgs/:id" component={EditTgk} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
