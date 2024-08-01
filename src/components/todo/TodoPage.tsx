import React, { useCallback, useEffect, useState } from 'react';
import InputField from '../todo/InputFeild';
import { Todo } from "../../model";
import TodoList from "../todo/TodoList";
// import axios from 'axios';
import { useNavigate } from "react-router-dom";


interface User {
    token: string;
    userId: number;
}


const TodoPage = () => {
    const navigate = useNavigate();


    // const [isLogin, setIsLogin] = useState(true);
    const [user, setUser] = useState<User>();
    const [todo, setTodo] = useState<string>("");
    const [todos, setTodos] = useState<Todo[]>([]);
    
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      console.log(storedUser,"user");
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }else{
        navigate("/");
      }
    }, []);
  
    const refreshTodos = useCallback(() => {
      const fetchTodos = async () => {
        if (!user) {
          console.error('User is not logged in');
          return;
        }
    
        try {
          // const response = await fetch(`http://localhost:8000/api/tasks/${user.userId}`, {
          const response = await fetch(`http://localhost:8000/api/task`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            }
          });
    
          if (!response.ok) {
            
            localStorage.removeItem('user')
            navigate("/")
            throw new Error('Failed to fetch data');
          }
    
          const data = await response.json();
          console.log('Fetched data:', data);
  
  
          const formattedTodos = data.map((item: any) => ({
            id: item.id,
            todo: item.title,
            status: item.status
          }));

          console.log(data,"data");
          
  
          // Assuming the API returns an array of Todo objects
          setTodos(formattedTodos);
        } catch (error) {
          console.error('Error fetching todos:', error);
        }
      }
    
      if (user) {
        fetchTodos();
      }
    }, [user, setTodos]);
    
    useEffect(() => {
      refreshTodos();
    }, [refreshTodos]);
  
    // const handleLogout = () => {
    //   setUser(null);
    //   localStorage.removeItem('user');
    // };

    const handleLogout = async () => {

      try {
       
         await fetch(`http://localhost:8000/auth/logout/`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          }
        });

        localStorage.removeItem('user');
        // Redirect to login page or home
        navigate('/');
      } catch (error) {
        console.error('Logout failed', error);
      }
    };
  
  
    const handleAdd = async (e: React.FormEvent) => {
      e.preventDefault();
      if (todo && user) {
        try {
          const response = await fetch(`http://localhost:8000/api/task`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ todo: todo, isDone: false ,userId: user.userId})
          });
    
          if (!response.ok) {
            throw new Error('Failed to add todo');
          }
    
          refreshTodos()

          setTodo("");
        } catch (error) {
          console.error('Error adding todo:', error);
        }
      }
    };

  return (
    <div className="App">
      <>
      <span className='heading'>TASK TODO</span>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      </>
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <TodoList todos={todos} setTodos={setTodos} refreshTodos={refreshTodos} user={user}/>
    </div>
  )
}

export default TodoPage
