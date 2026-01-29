import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, GripVertical, Loader2, X, Upload } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  type: string;
  status: 'Done' | 'In Process' | 'Pending';
}

const INITIAL_DATA: Project[] = [
  { id: 1, name: 'Cover page', type: 'Marchés de Travaux', status: 'In Process' },
  { id: 2, name: 'Table of contents', type: 'Marchés de Services', status: 'Done' },
  { id: 3, name: 'Executive summary', type: 'Marchés de Fournitures', status: 'Done' },
];

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Form State
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('Marchés de Travaux');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: projects.length + 1,
      name: newName,
      type: newType,
      status: 'Pending',
    };
    setProjects([newProject, ...projects]);
    // Reset and close
    setNewName('');
    setSelectedFile(null);
    setIsModalOpen(false);
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full animate-in fade-in duration-500 bg-transparent">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-8 gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            className="block w-full bg-[#111111] border border-gray-800 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 transition-all text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3 shrink-0">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-all shadow-lg active:scale-95">
            <Plus size={16} />
            <span className="text-sm font-bold whitespace-nowrap">Add Project</span>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-800 bg-[#0f0f0f]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider bg-[#111111]/50">
              <th className="p-4 w-10"></th>
              <th className="p-4 font-semibold">Project Name</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold text-right pr-10">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {filteredProjects.map((row) => (
              <tr key={row.id} className="hover:bg-[#161616] group transition-colors">
                <td className="p-4 w-10 text-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-gray-600">
                    <GripVertical size={14} />
                  </div>
                </td>
                <td
                  className="p-4 font-medium text-gray-200 text-sm cursor-pointer hover:text-white hover:underline transition-all"
                  onClick={() => navigate(`/projects/${row.id}`)}
                >
                  {row.name}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-[#1a1a1a] border border-gray-800 text-[10px] font-bold text-gray-400">
                    {row.type}
                  </span>
                </td>
                <td className="p-4 text-right pr-10">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#111111] border border-gray-800 w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Project Name</label>
                <input
                  required
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-600"
                  placeholder="e.g. Construction Main Office"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Select Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-md py-2 px-3 text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-600 appearance-none"
                >
                  <option value="Marchés de Travaux">Marchés de Travaux</option>
                  <option value="Marchés de Fournitures">Marchés de Fournitures</option>
                  <option value="Marchés de Services">Marchés de Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CPS File (PDF)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-800 rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#1a1a1a] hover:border-gray-600 transition-all"
                >
                  <Upload size={24} className="text-gray-600" />
                  <span className="text-sm text-gray-400 text-center">
                    {selectedFile ? selectedFile.name : "Click to upload or drag CPS document"}
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-md border border-gray-800 text-gray-400 hover:bg-gray-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-white text-black px-4 py-2 rounded-md font-bold hover:bg-gray-200 transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface StatusBadgeProps {
  status: 'Done' | 'In Process' | 'Pending';
}

// ... StatusBadge component stays the same as your code ...
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (status === 'Done') return (
    <span className="inline-flex items-center gap-2 text-[11px] text-green-500 font-bold uppercase tracking-tight">
      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> Done
    </span>
  );
  if (status === 'Pending') return (
    <span className="inline-flex items-center gap-2 text-[11px] text-amber-500/80 font-bold uppercase tracking-tight">
      <div className="w-2 h-2 rounded-full border border-amber-500/50" /> Pending
    </span>
  );
  return (
    <span className="inline-flex items-center gap-2 text-[11px] text-zinc-400 font-bold uppercase tracking-tight">
      <Loader2 size={12} className="animate-spin" />
      In Process
    </span>
  );
};

export default Projects;