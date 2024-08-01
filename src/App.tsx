import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import InputField from './components/todo/InputFeild';
import { Todo } from "./model";
import TodoList from "./components/todo/TodoList";
import LoginForm from './components/login/LoginForm';
import RegisterForm from './components/register/RegisterForm';
import TodoPage from './components/todo/TodoPage';

const App: React.FC = () => {
 
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={
          user ? (
            <Navigate to="/todo" replace />
          ) : (
            isLogin ? (
              <LoginForm onSwitchToRegister={switchForm} onLoginSuccess={handleLoginSuccess} />
            ) : (
              <RegisterForm onSwitchToLogin={switchForm} />
            )
          )
        } /> */}
        <Route path="/" element={
          <LoginForm />
        } />
        <Route path="/register" element={
          <RegisterForm />
        } />
        <Route path="/todo" element={
          <TodoPage />
        } />
        {/* <Route path="/todo" element={
          user ? <TodoApp /> : <Navigate to="/" replace />
        } /> */}
      </Routes>
    </Router>
  );
}

export default App;