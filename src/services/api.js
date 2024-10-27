const API_URL = 'http://localhost:8081'; // Replace with your actual API endpoint

// Fetch all todos
export const getTodos = async () => {
  try {
    const response = await fetch("http://localhost:8081/todo"); // Corrected endpointx
    if (!response.ok) throw new Error("Failed to fetch todos");
    return await response.json();
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

// Update a todo's status
export const updateTodo = async (id, done, completedDate) => {
  try {
    const response = await fetch(`${API_URL}/todo/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ done, completedDate }),
    });
    if (!response.ok) throw new Error("Failed to update todo");
    return await response.json();
  } catch (error) {
    console.error("Error updating todo:", error);
    return {}; // Default return value in case of error
  }
};

// Delete a todo
export const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${API_URL}/todo/${id}`, { // Corrected endpoint
      method: 'DELETE',
    });
    if (!response.ok) throw new Error("Failed to delete todo");
    return response.ok;
  } catch (error) {
    console.error("Error deleting todo:", error);
    return false; // Default return value in case of error
  }
};