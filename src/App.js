
import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit, Check, X, Circle, CheckCircle2 } from 'lucide-react';

const TodoApp = () => {
    const [todos, setTodos] = useState([
        { id: 1, text: 'Finalize project proposal', completed: false, priority: 'High' },
        { id: 2, text: 'Schedule team meeting', completed: true, priority: 'Medium' },
        { id: 3, text: 'Update weekly report', completed: false, priority: 'Low' },
    ]);
    const [newTodo, setNewTodo] = useState('');
    const [newPriority, setNewPriority] = useState('Medium');
    const [filter, setFilter] = useState('all');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [editingPriority, setEditingPriority] = useState('Medium');

    const handleAddTodo = (e) => {
        e.preventDefault();
        if (newTodo.trim() === '') return;
        const newTask = {
            id: Date.now(),
            text: newTodo.trim(),
            completed: false,
            priority: newPriority,
        };
        setTodos([newTask, ...todos]);
        setNewTodo('');
        setNewPriority('Medium');
    };

    const handleDeleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const handleToggleComplete = (id) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const handleStartEditing = (todo) => {
        setEditingId(todo.id);
        setEditingText(todo.text);
        setEditingPriority(todo.priority);
    };

    const handleCancelEditing = () => {
        setEditingId(null);
        setEditingText('');
    };

    const handleUpdateTodo = (e) => {
        e.preventDefault();
        if (editingText.trim() === '') return;
        setTodos(
            todos.map(todo =>
                todo.id === editingId ? { ...todo, text: editingText.trim(), priority: editingPriority } : todo
            )
        );
        handleCancelEditing();
    };

    const filteredTodos = useMemo(() => {
        switch (filter) {
            case 'active':
                return todos.filter(todo => !todo.completed);
            case 'completed':
                return todos.filter(todo => todo.completed);
            default:
                return todos;
        }
    }, [todos, filter]);

    const activeTodosCount = useMemo(() => {
        return todos.filter(todo => !todo.completed).length;
    }, [todos]);

    const PriorityBadge = ({ priority }) => {
        const priorityStyles = {
            High: 'bg-red-100 text-red-800 border-red-200',
            Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            Low: 'bg-blue-100 text-blue-800 border-blue-200',
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityStyles[priority]}`}>
                {priority}
            </span>
        );
    };

    return (
        <div className="bg-slate-100 min-h-screen font-sans text-slate-800 p-4 sm:p-6 md:p-8">
            <main className="max-w-2xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-green-800">Todo List</h1>
                    <p className="text-slate-500 mt-2">Stay organized and productive.</p>
                </header>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <form onSubmit={handleAddTodo} className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="relative flex-grow w-full">
                           <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="Add a new task..."
                                className="w-full pl-4 pr-12 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-200"
                            />
                        </div>
                         <div className="flex gap-3 w-full sm:w-auto">
                            <select
                                value={newPriority}
                                onChange={(e) => setNewPriority(e.target.value)}
                                className="w-full sm:w-auto px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow duration-200 bg-white"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <button
                                type="submit"
                                className="flex-shrink-0 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                aria-label="Add new todo"
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-xl shadow-lg">
                    <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex gap-2">
                            {['all', 'active', 'completed'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`capitalize px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                                        filter === f
                                            ? 'bg-green-100 text-green-800'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <span className="text-sm text-slate-500 font-medium">{activeTodosCount} tasks left</span>
                    </div>

                    <ul className="divide-y divide-slate-200">
                        {filteredTodos.map(todo => (
                            <li key={todo.id} className="p-4 transition-colors duration-200 hover:bg-slate-50">
                                {editingId === todo.id ? (
                                    <form onSubmit={handleUpdateTodo} className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            className="flex-grow p-2 rounded-md border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            autoFocus
                                        />
                                        <select
                                            value={editingPriority}
                                            onChange={(e) => setEditingPriority(e.target.value)}
                                            className="p-2 rounded-md border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                        <div className="flex gap-2">
                                            <button type="submit" aria-label="Save changes" className="text-green-600 hover:text-green-800"><Check size={20} /></button>
                                            <button type="button" onClick={handleCancelEditing} aria-label="Cancel editing" className="text-slate-500 hover:text-slate-700"><X size={20} /></button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleToggleComplete(todo.id)} aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}>
                                            {todo.completed ? (
                                                <CheckCircle2 size={24} className="text-green-500" />
                                            ) : (
                                                <Circle size={24} className="text-slate-400" />
                                            )}
                                        </button>
                                        <div className="flex-grow">
                                            <p className={`text-slate-800 ${todo.completed ? 'line-through text-slate-400' : ''}`}>
                                                {todo.text}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <PriorityBadge priority={todo.priority} />
                                            <button onClick={() => handleStartEditing(todo)} aria-label="Edit todo" className="text-slate-500 hover:text-blue-600 transition-colors duration-200"><Edit size={18} /></button>
                                            <button onClick={() => handleDeleteTodo(todo.id)} aria-label="Delete todo" className="text-slate-500 hover:text-red-600 transition-colors duration-200"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                         {filteredTodos.length === 0 && (
                            <li className="p-6 text-center text-slate-500">
                                {filter === 'completed' ? "No completed tasks yet!" : "You're all caught up!"}
                            </li>
                        )}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default TodoApp;
