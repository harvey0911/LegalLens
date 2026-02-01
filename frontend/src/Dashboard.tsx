import React, { useEffect, useState } from 'react';
import api from './api/axios'; 
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Gavel,
  Plus,
  Circle,
  CheckCircle,
  X,
  Send,
  Trash2,
  FilterX
} from 'lucide-react';

interface DashboardStats {
  Done: number;
  'In Process': number;
  Pending: number;
}

interface ProjectSummary {
  name: string;
  type: string;
  status: string;
}

interface DemoTask {
  id: number;
  description: string; 
  is_completed: boolean;
}

const Dashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<DashboardStats>({ Done: 0, 'In Process': 0, Pending: 0 });
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New State for filtering
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [todoTasks, setTodoTasks] = useState<DemoTask[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, projectsRes] = await Promise.all([
          api.get('/projects/stats'),
          api.get('/projects/summary')
        ]);
        setStatsData(statsRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error("Error loading stats/projects:", error);
      }

      try {
        const tasksRes = await api.get('/tasks');
        setTodoTasks(tasksRes.data);
      } catch (error) {
        console.error("Tasks API error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Filter Logic
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.status === activeFilter);

  // Handlers for Tasks
  const addTask = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTaskText.trim()) return;
    try {
      const response = await api.post('/tasks', { description: newTaskText });
      setTodoTasks([response.data, ...todoTasks]);
      setNewTaskText("");
      setIsAdding(false);
    } catch (error) { console.error(error); }
  };

  const toggleTask = async (id: number, currentStatus: boolean) => {
    try {
      const response = await api.patch(`/tasks/${id}`, { is_completed: !currentStatus });
      setTodoTasks(prev => prev.map(t => t.id === id ? response.data : t));
    } catch (error) { console.error(error); }
  };

  const deleteTask = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); 
    try {
      await api.delete(`/tasks/${id}`);
      setTodoTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) { console.error(error); }
  };

  const stats = [
    { 
        label: 'Total Cases', 
        filterKey: 'All',
        value: statsData.Done + statsData['In Process'] + statsData.Pending, 
        icon: Gavel, 
        color: 'text-blue-500', 
        bg: 'hover:border-blue-500/50'
    },
    { 
        label: 'Active Projects', 
        filterKey: 'In Process',
        value: statsData['In Process'], 
        icon: Clock, 
        color: 'text-amber-500', 
        bg: 'hover:border-amber-500/50'
    },
    { 
        label: 'Completed', 
        filterKey: 'Done',
        value: statsData.Done, 
        icon: CheckCircle2, 
        color: 'text-green-500', 
        bg: 'hover:border-green-500/50'
    },
    { 
        label: 'Pending Review', 
        filterKey: 'Pending',
        value: statsData.Pending, 
        icon: AlertCircle, 
        color: 'text-rose-500', 
        bg: 'hover:border-rose-500/50'
    },
  ];

  const completionRate = todoTasks.length > 0 
    ? Math.round((todoTasks.filter(t => t.is_completed).length / todoTasks.length) * 100) 
    : 0;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back, Counselor</h1>
            <p className="text-gray-500 text-sm">Click on a category to filter your projects.</p>
        </div>
        {activeFilter !== 'All' && (
            <button 
                onClick={() => setActiveFilter('All')}
                className="flex items-center gap-2 text-xs text-blue-500 hover:text-blue-400 transition-colors mb-1"
            >
                <FilterX size={14}/> Clear Filter
            </button>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            onClick={() => setActiveFilter(stat.filterKey)}
            className={`cursor-pointer bg-[#161616] border p-5 rounded-xl transition-all duration-300 ${
              activeFilter === stat.filterKey 
              ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-[1.02]' 
              : 'border-gray-800 hover:border-gray-600'
            } ${stat.bg}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-[#1a1a1a] border border-gray-800 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                  activeFilter === stat.filterKey ? 'bg-white text-black' : 'bg-zinc-500/10 text-zinc-500'
              }`}>
                {stat.filterKey}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">
                {loading ? "..." : stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Filtered Project List */}
        <div className="lg:col-span-2 bg-[#161616] border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-white">
                {activeFilter === 'All' ? 'Current Projects' : `${activeFilter} Projects`}
             </h3>
             <span className="text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                {filteredProjects.length} Result{filteredProjects.length !== 1 ? 's' : ''}
             </span>
          </div>
          
          <div className="space-y-4">
            {filteredProjects.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                    <AlertCircle size={32} className="mb-2 opacity-20"/>
                    <p className="text-sm italic text-center">No projects found for this category.</p>
                </div>
            )}
            {filteredProjects.map((project, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-[#1a1a1a] border border-gray-800/50 hover:border-gray-700 transition-all">
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">{project.name}</h4>
                  <p className="text-xs text-gray-500">{project.type}</p>
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                  project.status === 'Done' ? 'text-green-500 bg-green-500/10' :
                  project.status === 'Pending' ? 'text-rose-500 bg-rose-500/10' :
                  'text-amber-500 bg-amber-500/10'
                }`}>
                  {project.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side Section: Todo-List (Unchanged) */}
        <div className="bg-[#161616] border border-gray-800 rounded-xl p-6 flex flex-col h-full min-h-[450px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Daily Tasks</h3>
            <button onClick={() => setIsAdding(!isAdding)} className={`p-1.5 rounded-lg transition-all ${isAdding ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white'}`}>
              {isAdding ? <X size={18} /> : <Plus size={18} />}
            </button>
          </div>

          {isAdding && (
            <form onSubmit={addTask} className="mb-6 animate-in slide-in-from-top-2 duration-300">
              <div className="relative">
                <input autoFocus type="text" placeholder="Add a new task..." className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white outline-none focus:border-blue-500 transition-all" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-500">
                  <Send size={16} />
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] pr-1">
            {todoTasks.map((task) => (
              <div key={task.id} onClick={() => toggleTask(task.id, task.is_completed)} className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${task.is_completed ? 'bg-zinc-900/40 border-transparent opacity-60' : 'bg-[#1a1a1a] border-gray-800 hover:border-gray-600'}`}>
                <div className="flex gap-3">
                  <div className="mt-0.5">{task.is_completed ? <CheckCircle className="text-green-500" size={18} /> : <Circle className="text-gray-600 group-hover:text-blue-500" size={18} />}</div>
                  <p className={`text-sm font-medium transition-all ${task.is_completed ? 'text-gray-600 line-through' : 'text-gray-300'}`}>{task.description}</p>
                </div>
                <button onClick={(e) => deleteTask(e, task.id)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-gray-800">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500 font-medium">Daily Progress</span>
              <span className="text-white font-bold">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-500 ease-out" style={{ width: `${completionRate}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;