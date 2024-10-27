import React, { useState } from 'react';
import todo_icon from '../assets/todo_icon.png';
import TodoItems from './TodoItems';

const Todo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [refreshTodos, setRefreshTodos] = useState(false); // To trigger TodoItems refresh

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
          createdAt: new Date().toISOString() // Add the current time as createdAt
        })
      });
      if (!response.ok) throw new Error('Failed to add task');

      setTitle(''); 
      setDescription(''); 
      setError(null); 
      setRefreshTodos(prev => !prev); // Trigger refresh for TodoItems
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Could not add the task. Please try again.");
    }
  };

  return (
    <div className='bg-white place-self-center w-11/12 max-w-md flex flex-col p-7 min-h-[550px] rounded-xl'>
      
      <div className='flex items-center mt-7 gap-2'>
        <img className='w-8' src={todo_icon} alt="To-do Icon" />
        <h1 className='text-3xl font-semibold'>To-Do List</h1>
      </div>

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

      <div>
        <TodoItems refreshTodos={refreshTodos} />
      </div>
    </div>
  );
};

export default Todo;