import React, { useState, useEffect } from "react";
import axios from "axios";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch to-do items from the backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/todos", {
          withCredentials: true,
        });
        setTodos(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load to-do items. Please try again.");
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Add a new to-do item
  const addTodo = async () => {
    if (!newTodo.trim()) return; // Prevent adding empty tasks
    try {
      const res = await axios.post(
        "http://localhost:5000/api/todos",
        { title: newTodo },
        { withCredentials: true }
      );
      setTodos([...todos, res.data]);
      setNewTodo("");
    } catch (err) {
      setError("Failed to add to-do. Please try again.");
    }
  };

  // Toggle the completion status of a to-do item
  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        { completed: !completed },
        { withCredentials: true }
      );
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    } catch (err) {
      setError("Failed to update to-do. Please try again.");
    }
  };

  // Delete a to-do item
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        withCredentials: true,
      });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete to-do. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">To-Do List</h1>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add New To-Do */}
      <div className="flex mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {/* Loading State */}
      {loading && <p>Loading to-do items...</p>}

      {/* To-Do List */}
      {!loading && todos.length === 0 && (
        <p className="text-gray-500">No tasks yet. Add your first task!</p>
      )}
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex items-center justify-between p-4 rounded-lg shadow ${
              todo.completed ? "bg-green-100" : "bg-gray-100"
            }`}
          >
            <span
              className={`flex-1 cursor-pointer ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
              onClick={() => toggleTodo(todo.id, todo.completed)}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-600 hover:text-red-800 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;