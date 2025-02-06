import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Pencil, Trash, Check, X } from "lucide-react";

const TodoComponent = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  const sortTodos = (todosArray) => {
    return [...todosArray].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      // Newest tasks first for incomplete, oldest first for completed
      return a.completed
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    });
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/todo",
        getAuthHeader()
      );
      setTodos(sortTodos(data.data));
    } catch (error) {
      console.error("Error fetching todos:", error.message);
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
    }
  };

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/todo/${id}`, getAuthHeader());
      setTodos(sortTodos(todos.filter((todo) => todo._id !== id)));
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

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
      setTodos(
        sortTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)))
      );
    } catch (error) {
      console.error("Error toggling todo:", error.message);
    }
  };

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
      setTodos(
        sortTodos(
          todos.map((todo) => (todo._id === editingId ? updatedTodo : todo))
        )
      );
      setEditingId(null);
      setEditedTitle("");
    } catch (error) {
      console.error("Error updating todo:", error.message);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedTitle("");
  };

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
          <Plus />
        </button>
      </div>

      {/* Tasks List Section */}
      <div className="w-full space-y-2 mt-4 max-h-64 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="text-gray-400">No tasks available</div>
        ) : (
          todos.map((todo) => (
            // Added the "group" class to enable hover effects
            <div
              key={todo._id}
              className="group flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
            >
              <label className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo._id)}
                  className="w-5 h-5 rounded-full border border-gray-500 appearance-none checked:bg-purple-500 checked:border-purple-500 focus:outline-none"
                />
                {todo.completed && (
                  <Check className="absolute w-full text-white pointer-events-none" />
                )}
              </label>

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

              {editingId === todo._id ? (
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="text-green-500 hover:text-green-400 transition-colors"
                  >
                    <Check />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <X />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 group-hover:hidden">
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </span>
                  <div className="hidden group-hover:flex gap-4">
                    <button
                      onClick={() => {
                        setEditingId(todo._id);
                        setEditedTitle(todo.title);
                      }}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Pencil className="h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash className="h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodoComponent;
