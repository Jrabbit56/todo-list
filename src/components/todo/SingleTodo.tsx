import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../model';
import { CiEdit } from 'react-icons/ci';
import { MdDelete, MdOutlineDone } from 'react-icons/md';
import './styles.css';

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  user?: { token: string };
  refreshTodos: () => void;
};

const SingleTodo = ({ todo, todos, setTodos, user ,refreshTodos}: Props) => {
  const [edit, setEdit] = useState(false);
  const [editTodo, setEditTodo] = useState(todo.todo);

  const handleDone = async (id: number) => {
    // console.log(todo,"Single");
    // console.log(todos,"All");
    // const found = todos.find(x => x.id === id);
    // console.log(found);
    
    try {

      let status = ''
      if(todo.status === 'in_progress') {
          status = 'completed';
      }else{
          status = 'in_progress';
      }

      const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token ?? ''}`
        },
        body: JSON.stringify({ status: status })
      });

      if (!response.ok) {
        throw new Error('Failed to update the todo');
      }
      refreshTodos()
      setEdit(false);
    } catch (error) {
      console.error(error);
      alert('Failed to update the todo. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this todo?");

    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token ?? ''}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete the todo');
        }

        setTodos(todos.filter((todo) => todo.id !== id));
      } catch (error) {
        console.error(error);
        alert('Failed to delete the todo. Please try again.');
      }
    }
  };

  const handleEdit = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const isConfirmed = window.confirm("Are you sure you want to save these changes?");

    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8000/api/tasks/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token ?? ''}`
          },
          body: JSON.stringify({ todo: editTodo })
        });

        if (!response.ok) {
          throw new Error('Failed to update the todo');
        }
        refreshTodos()
        setEdit(false);
      } catch (error) {
        console.error(error);
        alert('Failed to update the todo. Please try again.');
      }
    } else {
      setEditTodo(todo.todo);
      setEdit(false);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (edit) {
      inputRef.current?.focus();
    }
  }, [edit]);

  return (
    <form className='todos__single' onSubmit={(e) => handleEdit(e, todo.id)}>
      {edit ? (
        <input
          value={editTodo}
          onChange={(e) => setEditTodo(e.target.value)}
          className='todos__single--text'
          ref={inputRef}
        />
      ) : (
        <span className={todo.status === 'completed' ? 'todos__single--text--done' : 'todos__single--text'}>
          {todo.todo}
        </span>
      )}
      <div>
        <span className='icon' onClick={() => {
          if (!edit && todo.status ==='in_progress') {
            setEdit(!edit);
          }
        }}>
          <CiEdit />
        </span>

      {
        !edit ? (
          <>
            <span className='icon' onClick={() => handleDelete(todo.id)}>
                <MdDelete />
              </span>
              <span className='icon' onClick={() => handleDone(todo.id)}>
                <MdOutlineDone />
              </span>
          </>
          
        ) : ( 
          <span></span>
        )

      }
  
      </div>
    </form>
  );
};

export default SingleTodo;
