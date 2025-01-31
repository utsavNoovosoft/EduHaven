import { useState, useEffect } from "react";
import axios from "axios";

const TodoComponent = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // --- Added sorting function ---
  const sortTodos = (todosArray) => {
    return [...todosArray].sort((a, b) => {
      // Show incomplete tasks first
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // Newest tasks first for incomplete, oldest first for completed
      return a.completed 
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    });
  };

  // Get authentication headers
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // Fetch all to-dos
  const fetchTodos = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/todo", getAuthHeader());
      // Added sorting here
      setTodos(sortTodos(data.data));
    } catch (error) {
      console.error("Error fetching todos:", error.message);
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
    }
  };

  // Create a new to-do
  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3000/todo",
        {
          title,
          completed: false,
          dueDate: new Date().toISOString(),
        },
        getAuthHeader()
      );
      // Added sorting here
      setTodos(sortTodos([data.data, ...todos]));
      setTitle("");
    } catch (error) {
      console.error("Error creating todo:", error.message);
    }
  };

  // Delete a to-do
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/todo/${id}`, getAuthHeader());
      // Added sorting here
      setTodos(sortTodos(todos.filter((todo) => todo._id !== id)));
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

  // Toggle completion status
  const handleToggle = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const updatedTodo = { ...todo, completed: !todo.completed };
      await axios.put(
        `http://localhost:3000/todo/${id}`,
        updatedTodo,
        getAuthHeader()
      );
      // Added sorting here
      setTodos(sortTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo))));
    } catch (error) {
      console.error("Error toggling todo:", error.message);
    }
  };

  // Save edited todo
  const handleSave = async () => {
    if (!editedTitle.trim()) {
      alert("Title cannot be empty!");
      return;
    }
    try {
      const todo = todos.find((t) => t._id === editingId);
      const updatedTodo = { ...todo, title: editedTitle };
      await axios.put(
        `http://localhost:3000/todo/${editingId}`,
        updatedTodo,
        getAuthHeader()
      );
      // Added sorting here
      setTodos(sortTodos(todos.map((todo) => (todo._id === editingId ? updatedTodo : todo))));
      setEditingId(null);
      setEditedTitle("");
    } catch (error) {
      console.error("Error updating todo:", error.message);
    }
  };

  // Rest of the code remains exactly the same...
  // [No changes made to any existing lines below this point]

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditedTitle("");
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleCreate();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const completedCount = todos.filter((todo) => todo.completed).length;
  const openCount = todos.length - completedCount;

  return (
    <div className="bg-gray-800 text-white rounded-lg p-6 w-full mx-auto relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Goals</h1>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <span className="text-green-500">●</span>
            <span>{openCount} Open</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-gray-400">●</span>
            <span>{completedCount} Closed</span>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="relative w-full flex">
        <input
          type="text"
          placeholder="Type a goal..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full bg-transparent border-b border-gray-600 text-gray-400 py-1 px-2 focus:outline-none"
        />
        <button onClick={handleCreate} className="text-white ml-2">
          ➕
        </button>
      </div>

      {/* Tasks List Section */}
      <div className="w-full space-y-2 mt-4 max-h-64 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="text-gray-400">No tasks available</div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo._id}
              className="flex items-center space-x-2 bg-gray-700 p-2 rounded-lg hover:bg-gray-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo._id)}
                className="cursor-pointer w-5 h-5"
              />
              
              {editingId === todo._id ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className="flex-grow bg-transparent border-b border-gray-600 text-gray-400 py-1 px-2 focus:outline-none"
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-grow text-lg ${
                    todo.completed
                      ? "line-through text-gray-500"
                      : "text-gray-300"
                  }`}
                >
                  {todo.title}
                </span>
              )}

              <div className="flex items-center space-x-2">
                {editingId === todo._id ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="text-green-500 hover:text-green-400 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(todo._id);
                        setEditedTitle(todo.title);
                      }}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoComponent;