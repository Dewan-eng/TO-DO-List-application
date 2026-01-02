import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Calendar, 
  Flag, 
  Save, 
  CheckCircle2, 
  Circle,
  ListTodo
} from 'lucide-react';

export default function App() {
  // --- State Management ---
  const [tasks, setTasks] = useState(() => {
    // Load from local storage on initial render
    try {
      const saved = localStorage.getItem('zenTasks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load tasks", e);
      return [];
    }
  });

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: ''
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  // --- Effects ---
  useEffect(() => {
    // Save to local storage whenever tasks change
    localStorage.setItem('zenTasks', JSON.stringify(tasks));
  }, [tasks]);

  // --- Handlers ---
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now(),
      ...newTask,
      completed: false,
      isEditing: false,
      createdAt: new Date().toISOString()
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '' });
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleToggleComplete = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const handleEditToggle = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, isEditing: !t.isEditing } : t
    ));
  };

  const handleSaveEdit = (id, newTitle, newDesc) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, title: newTitle, description: newDesc, isEditing: false } : t
    ));
  };

  // --- Utility Components ---
  const PriorityBadge = ({ level }) => {
    const colors = {
      High: 'bg-red-100 text-red-700 border-red-200',
      Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Low: 'bg-green-100 text-green-700 border-green-200'
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full border font-medium flex items-center gap-1 ${colors[level] || colors.Medium}`}>
        <Flag size={10} /> {level}
      </span>
    );
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <ListTodo size={24} />
              </div>
              ZenTask
            </h1>
            <div className="text-sm text-slate-500 font-medium">
              {tasks.filter(t => !t.completed).length} pending
            </div>
          </div>
          <p className="text-slate-500">Stay organized, focused, and calm.</p>
        </header>

        {/* Add Task Button (Mobile/Desktop Friendly) */}
        {!isFormOpen && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="w-full bg-white border border-dashed border-slate-300 rounded-xl p-4 text-slate-500 flex items-center justify-center gap-2 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md mb-6"
          >
            <Plus size={20} />
            <span>Create New Task</span>
          </button>
        )}

        {/* Task Creation Form */}
        {isFormOpen && (
          <form onSubmit={handleAddTask} className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-800">New Task</h2>
              <button type="button" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                <input 
                  type="text" 
                  placeholder="What needs to be done?" 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description (Optional)</label>
                <textarea 
                  placeholder="Add details..." 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all h-24 resize-none"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Priority</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
                  <input 
                    type="date" 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
              >
                <Plus size={18} /> Add Task
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 && !isFormOpen && (
            <div className="text-center py-12 px-4">
              <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-slate-400" />
              </div>
              <h3 className="text-slate-600 font-medium text-lg">All caught up!</h3>
              <p className="text-slate-400 text-sm mt-1">You have no pending tasks. Enjoy your day.</p>
            </div>
          )}

          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`group bg-white rounded-xl p-4 border transition-all duration-200 ${
                task.completed 
                  ? 'border-slate-100 bg-slate-50 opacity-75' 
                  : 'border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button 
                  onClick={() => handleToggleComplete(task.id)}
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    task.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-slate-300 text-transparent hover:border-indigo-400'
                  }`}
                >
                  <Check size={14} strokeWidth={3} />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {task.isEditing ? (
                    // Edit Mode
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <input 
                        defaultValue={task.title}
                        id={`edit-title-${task.id}`}
                        className="w-full p-2 text-sm font-semibold border rounded"
                        autoFocus
                      />
                      <textarea 
                        defaultValue={task.description}
                        id={`edit-desc-${task.id}`}
                        className="w-full p-2 text-sm border rounded h-16 resize-none"
                      />
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleSaveEdit(
                            task.id, 
                            document.getElementById(`edit-title-${task.id}`).value,
                            document.getElementById(`edit-desc-${task.id}`).value
                          )}
                          className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 hover:bg-indigo-700"
                        >
                          <Save size={12} /> Save
                        </button>
                        <button 
                          onClick={() => handleEditToggle(task.id)}
                          className="bg-slate-200 text-slate-600 text-xs px-3 py-1.5 rounded hover:bg-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-slate-800 break-words ${task.completed ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </h3>
                        <PriorityBadge level={task.priority} />
                      </div>
                      
                      {task.description && (
                        <p className={`text-sm text-slate-600 mb-2 break-words ${task.completed ? 'line-through text-slate-400' : ''}`}>
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                        {task.dueDate && (
                          <div className={`flex items-center gap-1 ${!task.completed && new Date(task.dueDate) < new Date() ? 'text-red-500 font-medium' : ''}`}>
                            <Calendar size={12} />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                {!task.isEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditToggle(task.id)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}