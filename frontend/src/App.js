import React, { useState, useEffect } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/todos')
      .then(res => res.json())
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTodo }),
    })
      .then(res => res.json())
      .then(todo => {
        setTodos([...todos, todo]);
        setNewTodo('');
      })
      .catch(console.error);
  };

  const toggleTodo = (id) => {
    fetch(`http://localhost:5000/api/todos/${id}/toggle`, {
      method: 'PUT',
    })
      .then(res => res.json())
      .then(updatedTodo => {
        setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      })
      .catch(console.error);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Todo List</h2>
      <input
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') addTodo(); }}
        placeholder="Add new todo"
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            style={{ cursor: 'pointer', textDecoration: todo.done ? 'line-through' : 'none' }}
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
