import React, { useState, useEffect } from 'react';
import './App.css';

interface Todo {
  id: number;
  text: string;
  done: boolean;
  dueDate?: Date;
  reminder?: Date;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleNewTodoTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoText(event.target.value);
  };

  const handleNewTodoSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodoText.trim() === '') {
      return;
    }
    const newTodo: Todo = {
      id: Date.now(),
      text: newTodoText.trim(),
      done: false,
    };
    setTodos([...todos, newTodo]);
    setNewTodoText('');
  };

  const handleTodoClick = (id: number) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            done: !todo.done,
          };
        }
        return todo;
      }),
    );
  };

  const handleTodoDelete = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleTodoEdit = (id: number, text: string) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            text,
          };
        }
        return todo;
      }),
    );
  };

  const handleTodoDueDateChange = (id: number, dueDate: Date) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            dueDate,
          };
        }
        return todo;
      }),
    );
  };

  const handleTodoReminderChange = (id: number, reminder: Date) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return {
            ...todo,
            reminder,
          };
        }
        return todo;
      }),
    );
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    switch (event.target.value) {
      case 'all':
        setTodos(todos.map(todo => ({ ...todo })));
        break;
      case 'completed':
        setTodos(todos.filter(todo => todo.done));
        break;
      case 'incomplete':
        setTodos(todos.filter(todo => !todo.done));
        break;
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLLIElement>, id: number) => {
    event.dataTransfer.setData('text/plain', id.toString());
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    const id = parseInt(event.dataTransfer.getData('text/plain'), 10);
    const fromIndex = todos.findIndex(todo => todo.id === id);
    const toIndex = index;
    if (fromIndex >= 0 && toIndex >= 0) {
      const newTodos = [...todos];
      newTodos.splice(toIndex, 0, newTodos.splice(fromIndex, 1)[0]);
      setTodos(newTodos);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <form onSubmit={handleNewTodoSubmit}>
        <input type="text" value={newTodoText} onChange={handleNewTodoTextChange} />
        <button type="submit">Add</button>
      </form>
      <label htmlFor="filter">Filter:</label>
      <select id="filter" onChange={handleFilterChange}>
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
      </select>
      <ul onDragOver={handleDragOver} onDrop={event => handleDrop(event, todos.length)}>
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            draggable
            onDragStart={event => handleDragStart(event, todo.id)}
            style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleTodoClick(todo.id)}
            />
            {todo.text}
            {todo.dueDate && <span> (due {todo.dueDate.toLocaleDateString()})</span>}
            {todo.reminder && <span> (reminder {todo.reminder.toLocaleString()})</span>}
            <button onClick={() => handleTodoDelete(todo.id)}>Delete</button>
            <button
              onClick={() => handleTodoEdit(todo.id, prompt('Edit todo:', todo.text) || '')}
            >
              Edit
            </button>
            <button
              onClick={() =>
                handleTodoDueDateChange(todo.id, new Date(prompt('Enter due date:')))
              }
            >
              Set Due Date
            </button>
            <button
              onClick={() =>
                handleTodoReminderChange(todo.id, new Date(prompt('Enter reminder time:')))
              }
            >
              Set Reminder
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

