import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import todo_icon from '../assets/todo_icon.png';
import TodoItems from './TodoItems';

const Todo = ({ initialRole }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [refreshTodos, setRefreshTodos] = useState(false);
  const [role, setRole] = useState(initialRole);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentRole = location.pathname.slice(1);
    if (currentRole === 'developer' || currentRole === 'manager') {
      setRole(currentRole);
    }
  }, [location]);

  const addTask = async () => {
    if (!title || !description) {
      setError("Both title and description are required.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description, 
          done: false, 
          createdAt: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('Failed to add task');

      setTitle(''); 
      setDescription(''); 
      setError(null); 
      setRefreshTodos(prev => !prev);
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Could not add the task. Please try again.");
    }
  };

  const toggleRole = () => {
    const newRole = role === 'developer' ? 'manager' : 'developer';
    setRole(newRole);
    navigate(`/${newRole}`);
  };

  return (
    <div className='bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl'>
      <div className='flex items-center mt-7 gap-2'>
        <img className='w-8' src={todo_icon} alt="To-do Icon" />
        <h1 className='text-3xl font-semibold'>To-Do List</h1>
        <div className='ml-auto flex items-center gap-2'>
          <span className='text-sm'>{role === 'developer' ? 'Developer' : 'Manager'}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={role === 'manager'} 
              onChange={toggleRole}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
          </label>
        </div>
      </div>

      {role === 'developer' && (
        <div className='flex flex-col my-7 gap-4'>
          <input
            type='text'
            placeholder='Add a new task title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='bg-gray-200 rounded-full h-14 px-6 placeholder:text-slate-600 border-none outline-none'
          />
          <textarea
            placeholder='Add a description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='bg-gray-200 rounded-lg h-20 px-6 py-3 placeholder:text-slate-600 border-none outline-none'
          ></textarea>
          <button
            onClick={addTask}
            className='bg-orange-600 h-14 rounded-full text-white text-lg font-medium cursor-pointer'
          >
            Add Task
          </button>
          {error && <p className='text-red-500 mt-2'>{error}</p>}
        </div>
      )}

      <div>
        <TodoItems refreshTodos={refreshTodos} role={role} />
      </div>
    </div>
  );
};

export default Todo;