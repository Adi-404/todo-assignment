import React, { useEffect, useState } from 'react';
import tick from '../assets/tick.png';
import not_tick from '../assets/not_tick.png';
import delete_icon from '../assets/delete.png';
import edit_icon from '../assets/edit.jpg';

const TodoItems = ({ refreshTodos, role }) => {
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
    const interval = setInterval(fetchTodos, 1500);
    return () => clearInterval(interval);
  }, [refreshTodos]);

  const clearError = () => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const updateTodo = async (id, updatedFields) => {
    try {
      const response = await fetch(`http://localhost:8081/todo/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (!response.ok) throw new Error('Failed to update todo');

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, ...updatedFields } : todo
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
    await updateTodo(id, { title: editTitle, description: editDescription });
    setIsEditing(null);
  };

  const toggleDoneStatus = (todo) => {
    if (role === 'manager') {
      const updateData = {
        title: todo.title,
        description: todo.description,
        done: !todo.done,
        completedDate: !todo.done ? new Date().toISOString() : null, // Only set completedDate if marking as done
      };
      updateTodo(todo.id, updateData);
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {todos.map((todo) => (
        <div key={todo.uniqueKey} className='flex flex-col my-3 gap-2 border-b pb-2'>
          {isEditing === todo.id ? (
            <div className='flex flex-col gap-2'>
              <input
                type='text'
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className='bg-gray-200 rounded-full px-6 h-10'
                autoFocus
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className='bg-gray-200 rounded-lg px-6 py-3 h-20'
              ></textarea>
              <div className="flex gap-2 mt-2">
                <button onClick={() => saveEdit(todo.id)} className='bg-orange-600 text-white px-3 py-2 rounded'>
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
                className={`flex items-center ${role === 'manager' ? 'cursor-pointer' : ''}`}
                onClick={() => toggleDoneStatus(todo)}
              >
                <img src={todo.done ? tick : not_tick} alt="Status Icon" className='w-7' />
                <p
                  className={`ml-4 text-[17px] text-slate-700 ${todo.done ? 'line-through' : ''}`}
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
              {role === 'manager' && (
                <img
                  src={delete_icon}
                  alt="Delete"
                  className='w-5 cursor-pointer ml-2'
                  onClick={() => deleteTodo(todo.id)}
                />
              )}
            </div>
          )}
          <p
            className={`ml-11 text-[15px] text-slate-500 ${todo.done ? 'line-through' : ''}`}
          >
            {todo.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TodoItems;