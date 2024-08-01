import React from 'react'
import "./styles.css";
import { Todo } from "../../model";
import SingleTodo from './SingleTodo';

interface Props {
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
    //setCompletedTodos: React.Dispatch<React.SetStateAction<Array<Todo>>>;
    refreshTodos: () => void;
    user?: { token: string };
    
}

const TodoList: React.FC<Props> = ({ todos, setTodos ,refreshTodos,user }) => {
  return (
    <div className="todos">
      {todos.map((todo) => (
        <SingleTodo
          key={todo.id}
          todo={todo}
          todos={todos}
          setTodos={setTodos}
          refreshTodos={refreshTodos}
          user={user}
        />
      ))}
    </div>
  );
}

export default TodoList
