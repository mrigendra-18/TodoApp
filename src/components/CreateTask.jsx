import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";

export default function CreateTask({ tasks, setTasks }) {
  const [task, setTask] = useState({ name: "", id: "", status: "todo" });

  const validateTask = (taskName, tasks) => {
    if (!taskName.trim()) return "Task name is required";
    if (tasks.some((t) => t.name.toLowerCase() === taskName.toLowerCase())) return "Task already exists";
    if (taskName.length < 3) return "Task name must be at least 3 characters";
    if (taskName.length > 20) return "Task name must be less than 20 characters";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.dismiss();
    const error = validateTask(task.name, tasks);
    if (error) {
      toast.error(error);
      return;
    }

    const newTask = { ...task, id: uuidv4() };
    setTasks((prev) => [...prev, newTask]);

    setTask({ name: "", id: "", status: "todo" });
    toast.success("Todo created successfully");
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 p-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg shadow-xl">
      <h2 className="text-3xl font-semibold text-center mb-8 text-indigo-800">Plan Your Day</h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center justify-between gap-6">
        <input
          id="task-name"
          type="text"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          placeholder="Enter your task here"
          className="bg-white rounded-md w-full md:w-96 px-5 py-3 text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-md px-8 py-3 transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Create Todo
        </button>
      </form>
    </div>
  );
}
