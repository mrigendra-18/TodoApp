import { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import toast from "react-hot-toast";

export default function ListTask({ tasks, setTasks }) {
    const [filteredTasks, setFilteredTasks] = useState({
        todo: [],
        progress: [],
        done: [],
    });

    useEffect(() => {
        setFilteredTasks({
            todo: tasks.filter((t) => t.status === "todo"),
            progress: tasks.filter((t) => t.status === "progress"),
            done: tasks.filter((t) => t.status === "done"),
        });
    }, [tasks]);

    return (
        <div className="flex flex-wrap gap-8 justify-center mt-10 px-4 md:px-8 lg:px-16">
            {["todo", "progress", "done"].map((status) => (
                <Section
                    key={status}
                    status={status}
                    tasks={filteredTasks[status]}
                    setTasks={setTasks}
                />
            ))}
        </div>
    );
}

function Section({ status, tasks, setTasks }) {
    const text =
        status === "todo" ? "To Do" : status === "progress" ? "In Progress" : "Done";
    const bg =
        status === "todo"
            ? "bg-red-500"
            : status === "progress"
            ? "bg-yellow-500"
            : "bg-green-500";

    const [{ isOver }, drop] = useDrop({
        accept: "task",
        drop: (item) => {
            if (item.status !== status) {
                setTasks((prev) =>
                    prev.map((t) => (t.id === item.id ? { ...t, status } : t))
                );
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div
            ref={drop}
            className={`w-full md:w-96 lg:w-128 bg-white rounded-lg p-6 transition-all transform hover:scale-105 
                shadow-lg ${isOver ? "bg-gray-100" : ""}`}
        >
            <Header text={text} bg={bg} count={tasks.length} />
            <div className="mt-6 space-y-4">
                {tasks.length === 0 ? (
                    <p className="text-gray-500 text-center italic">No tasks here</p>
                ) : (
                    tasks.map((task) => (
                        <Task
                            task={task}
                            key={task.id}
                            setTasks={setTasks}
                            showEdit={status === "todo"}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function Header({ text, bg, count }) {
    return (
        <div
            className={`${bg} flex justify-between items-center px-4 py-2 rounded-t-md text-white text-lg font-semibold shadow-md`}
        >
            <span>{text}</span>
            <div className="flex items-center justify-center bg-white text-black rounded-full w-8 h-8 font-bold shadow-md">
                {count}
            </div>
        </div>
    );
}

function Task({ task, setTasks, showEdit }) {
    const [{ isDragging }, drag] = useDrag({
        type: "task",
        item: { id: task.id, status: task.status },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const handleEdit = () => {
        const newName = prompt("Edit Task Name:", task.name);
        if (newName && newName.trim()) {
            setTasks((prev) =>
                prev.map((t) => (t.id === task.id ? { ...t, name: newName.trim() } : t))
            );
            toast.success("Todo updated successfully!");
        }
    };

    const handleDelete = () => {
        const confirmed = window.confirm("Are you sure you want to delete this task?");
        if (confirmed) {
            setTasks((prev) => prev.filter((t) => t.id !== task.id));
            toast.success("Todo deleted successfully!");
        }
    };

    return (
        <div
            ref={drag}
            className={`flex justify-between items-center bg-gray-50 p-4 rounded-lg transition-all 
                cursor-grab hover:bg-gray-200 hover:shadow-md ${isDragging ? "opacity-50" : "opacity-100"}`}
        >
            <p className="text-gray-700 font-medium text-base truncate">{task.name}</p>
            <div className="flex items-center space-x-3">
                {showEdit && (
                    <button
                        onClick={handleEdit}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                        Edit
                    </button>
                )}
                <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
