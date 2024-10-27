'use client'
import React, { useEffect, useState } from 'react';
import tick from '../assets/tick.png';
import not_tick from '../assets/not_tick.png';
import delete_icon from '../assets/delete.png';
import edit_icon from '../assets/edit.jpg';

const TodoItems = ({ refreshTodos }) => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://localhost:8081/todo');
        if (!response.ok) throw new Error('Failed to fetch todos');

        const data = await response.json();

        const todosWithProperFields = data.map((todo, index) => ({
          ...todo,
          createdDate: todo.createdDate || new Date().toISOString(),
          uniqueKey: todo.id || `todo-${index}-${Date.now()}`,
        }));

        setTodos(todosWithProperFields.reverse());
      } catch (error) {
        console.error("Error fetching todos:", error);
        setError("Could not load todos. Please try again later.");
        clearError();
      }
    };
    fetchTodos();
  }, [refreshTodos]);

  const clearError = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const toggleTodoStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8081/todo/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !currentStatus }),
      });
      if (!response.ok) throw new Error('Failed to update todo status');

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? { ...todo, done: !currentStatus, completedDate: !currentStatus ? new Date().toISOString() : null }
            : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
      setError("Could not update todo. Please try again.");
      clearError();
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/todo/delete/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      setTimeout(() => {
        fetchTodos();
      }, 500);
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("Could not delete todo. Please try again.");
      clearError();
    }
  };

  const startEditing = (todo) => {
    setIsEditing(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const cancelEditing = () => {
    setIsEditing(null);
    setEditTitle('');
    setEditDescription('');
  };

  const saveEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/todo/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      });
      if (!response.ok) throw new Error('Failed to update todo');

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, title: editTitle, description: editDescription } : todo
        )
      );
      setIsEditing(null);
    } catch (error) {
      console.error("Error saving todo:", error);
      setError("Could not save todo. Please try again.");
      clearError();
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {todos.map((todo) => (
        <div key={todo.uniqueKey} className='flex flex-col my-3 gap-2 border-b pb-2'>
          {isEditing === todo.id ? (
            <div className='flex flex-col gap-2'>
              <input
                type='text'
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className='bg-gray-200 rounded-full px-6'
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className='bg-gray-200 rounded-lg px-6 py-3'
              ></textarea>
              <div className="flex gap-2 mt-2">
                <button onClick={() => saveEdit(todo.id)} className='bg-green-500 text-white px-3 py-2 rounded'>
                  Save
                </button>
                <button onClick={cancelEditing} className='bg-gray-500 text-white px-3 py-2 rounded'>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className='flex items-center'>
              <div
                className='flex items-center cursor-pointer'
                onClick={() => toggleTodoStatus(todo.id, todo.done)}
              >
                <img src={todo.done ? tick : not_tick} alt="Status Icon" className='w-7' />
                <p
                  className={`ml-4 text-[17px] ${todo.done ? 'line-through text-slate-500' : 'text-slate-700'}`}
                >
                  {todo.title}
                </p>
              </div>

              <img
                src={edit_icon}
                alt="Edit"
                className='w-5 cursor-pointer ml-auto'
                onClick={() => startEditing(todo)}
              />
              
              <p
                className={`ml-11 text-[15px] ${todo.done ? 'line-through text-slate-400' : 'text-slate-500'}`}
              >
                {todo.description}
              </p>
              {todo.done ? (
                <p className='text-slate-400 ml-11 text-[13px]'>
                  Completed: {todo.completedDate ? formatDate(todo.completedDate) : "No completion date"}
                </p>
              ) : (
                <p className='text-slate-400 ml-11 text-[13px]'>
                  Created: {todo.createdDate ? formatDate(todo.createdDate) : "No date available"}
                </p>
              )}
              <img
                src={delete_icon}
                alt="Delete"
                className='w-5 cursor-pointer ml-auto'
                onClick={() => deleteTodo(todo.id)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TodoItems;