import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BarChart3, ChevronRight, PieChart } from 'lucide-react';

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const projects = [
    { id: 1, name: 'Construction de Pont R+4', date: '2024-01-20', candidates: 12, status: 'Analyzed' },
    { id: 2, name: 'Rénovation Siège Social', date: '2024-01-18', candidates: 8, status: 'Analyzed' },
    { id: 3, name: 'Installation Réseau IT', date: '2024-01-15', candidates: 5, status: 'Analyzed' },
  ];

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div className="relative max-w-md flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search analytics by project..."
            className="w-full bg-[#111111] border border-gray-800 rounded-md py-2 pl-10 pr-3 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
          <PieChart size={16} />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">AI Insights Active</span>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-lg border border-gray-800 bg-[#0f0f0f]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-[10px] uppercase tracking-widest bg-[#111111]/50">
              <th className="p-4 font-bold">Project Name</th>
              <th className="p-4 font-bold text-center">Analysis Date</th>
              <th className="p-4 font-bold text-center">Appels d'Offres</th>
              <th className="p-4 font-bold text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/40">
            {projects.map((proj) => (
              <tr 
                key={proj.id} 
                onClick={() => navigate(`/analytics/${proj.id}`)}
                className="hover:bg-[#141414] group cursor-pointer transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 size={16} className="text-gray-600 group-hover:text-blue-500" />
                    <span className="text-sm font-medium text-gray-200">{proj.name}</span>
                  </div>
                </td>
                <td className="p-4 text-center text-xs text-gray-500">{proj.date}</td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded bg-[#1a1a1a] text-[10px] font-bold text-gray-400 border border-gray-800">
                    {proj.candidates} Folders
                  </span>
                </td>
                <td className="p-4 text-right pr-8">
                  <button className="text-gray-600 group-hover:text-white transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;