import React, { useState, useEffect } from "react";
import axios from "axios";

const PRIORITY_OPTIONS = [
  { value: "important", label: "Important" },
  { value: "normal", label: "Normal" },
  { value: "not_important", label: "Not Important" },
];

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("normal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  // Timer to update remaining time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

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
    if (!newTodo.trim()) return;
    // Prevent adding if deadline is set and is in the past
    if (deadline) {
      const deadlineDate = new Date(deadline);
      if (deadlineDate < new Date()) {
        setError("Deadline cannot be in the past.");
        return;
      }
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/todos",
        { title: newTodo, deadline, priority },
        { withCredentials: true }
      );
      setTodos([...todos, res.data]);
      setNewTodo("");
      setDeadline("");
      setPriority("normal");
      setError(""); // Clear error on success
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

  // Helper to get color based on deadline
  const getDeadlineColor = (deadline) => {
    if (!deadline) return "bg-gray-100";
    const nowDate = new Date(now);
    const end = new Date(deadline);
    const diffMs = end - nowDate;
    const diffMin = diffMs / 60000;
    if (diffMin < 0) return "bg-gray-300 text-gray-500"; // Past
    if (diffMin < 10) return "bg-red-200 text-red-800";
    if (diffMin < 60) return "bg-yellow-100 text-yellow-800";
    if (diffMin < 1440) return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  // Helper to get priority badge
  const getPriorityBadge = (priority) => {
    if (priority === "important") return <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded">Important</span>;
    if (priority === "not_important") return <span className="ml-2 px-2 py-1 bg-gray-400 text-white text-xs rounded">Not Important</span>;
    return <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">Normal</span>;
  };

  // Helper to get remaining time string
  const getRemainingTime = (deadline) => {
    if (!deadline) return "";
    const end = new Date(deadline);
    let diff = end - now;
    if (diff <= 0) return "Time's up!";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);
    return [
      days > 0 ? `${days}d` : "",
      hours > 0 ? `${hours}h` : "",
      minutes > 0 ? `${minutes}m` : "",
      `${seconds}s`
    ].filter(Boolean).join(" ");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">To-Do List</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add New To-Do */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg"
        >
          {PRIORITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          onClick={addTodo}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </div>

      {loading && <p>Loading to-do items...</p>}

      {!loading && todos.length === 0 && (
        <p className="text-gray-500">No tasks yet. Add your first task!</p>
      )}
      <ul className="space-y-4">
        {todos.map((todo) => {
          const isPastDeadline = todo.deadline && new Date(todo.deadline) < new Date(now);
          return (
            <li
              key={todo.id}
              className={`flex items-center justify-between p-4 rounded-lg shadow ${getDeadlineColor(todo.deadline)} ${isPastDeadline ? "line-through opacity-60" : ""}`}
            >
              <div className="flex-1">
                <span
                  className={`cursor-pointer font-medium`}
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                >
                  {todo.title}
                </span>
                {getPriorityBadge(todo.priority)}
                {todo.deadline && (
                  <span className="ml-4 text-xs">
                    Deadline: {new Date(todo.deadline).toLocaleString()}
                    {" | "}
                    <span className={isPastDeadline ? "text-red-600" : ""}>
                      {getRemainingTime(todo.deadline)}
                    </span>
                  </span>
                )}
              </div>
              {/* Completion circle */}
              <button
                onClick={() => toggleTodo(todo.id, todo.completed)}
                className="ml-2 focus:outline-none"
                title={todo.completed ? "Mark as incomplete" : "Mark as completed"}
              >
                <span
                  className={`inline-block w-4 h-4 rounded-full border-2 ${todo.completed ? "bg-green-500 border-green-600" : "bg-gray-300 border-gray-400"}`}
                ></span>
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-600 hover:text-red-800 transition ml-4"
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TodoList;