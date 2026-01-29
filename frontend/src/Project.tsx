import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, ArrowLeft, Download, ExternalLink, 
  FileStack, Bot, Play, FileCheck, Loader2 
} from 'lucide-react';

const Project: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // States for AI Processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const projectInfo = {
    name: "Construction de Pont R+4",
    type: "Marchés de Travaux",
  };

  const appelsOffres = [
    { id: 101, title: "Offre Technique - Entreprise A", date: "2024-01-15", size: "4.2 MB" },
    { id: 102, title: "Bordereau des Prix - Entreprise A", date: "2024-01-15", size: "1.1 MB" },
    { id: 103, title: "Offre Technique - Entreprise B", date: "2024-01-16", size: "3.8 MB" },
  ];

  // Simulate AI Analysis
  const handleStartProcess = () => {
    setIsProcessing(true);
    setProgress(0);
  };

  useEffect(() => {
    if (isProcessing && progress < 100) {
      const timer = setTimeout(() => setProgress(prev => prev + 1), 50);
      return () => clearTimeout(timer);
    } else if (progress === 100) {
      setIsProcessing(false);
      setIsComplete(true);
    }
  }, [isProcessing, progress]);

  return (
    <div className="w-full h-[calc(100vh-120px)] flex flex-col animate-in fade-in duration-500 bg-[#0f0f0f]">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/projects')} className="p-2 rounded-full hover:bg-zinc-800 text-gray-400 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">{projectInfo.name}</h1>
            <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.2em] font-bold">{projectInfo.type}</p>
          </div>
        </div>

        {/* Action Buttons & Status */}
        <div className="flex items-center gap-3">
          {!isComplete && !isProcessing && (
            <button 
              onClick={handleStartProcess}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
            >
              <Bot size={18} />
              Process with AI
            </button>
          )}

          {isComplete && (
            <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-all shadow-lg animate-in zoom-in-90">
              <FileCheck size={18} />
              Generate Report
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar (Only visible during or after processing) */}
      {(isProcessing || isComplete) && (
        <div className="mb-8 space-y-2 animate-in slide-in-from-top-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              {isProcessing ? <Loader2 size={12} className="animate-spin text-blue-500" /> : <FileCheck size={12} className="text-green-500" />}
              {isProcessing ? "AI Analysis in progress..." : "Analysis Complete"}
            </span>
            <span className="text-xs font-bold text-white">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ease-out ${isComplete ? 'bg-green-500' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* LEFT: CPS VIEWER */}
        <div className="flex-[1.5] bg-[#111111] border border-gray-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-800 bg-[#161616]/50 flex justify-between items-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2 tracking-wider">
              <FileText size={14} /> Main Document (CPS)
            </span>
          </div>
          <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center text-gray-800 border-inner">
             <div className="text-center opacity-30">
                <FileText size={64} className="mx-auto mb-4" />
                <p className="text-xs uppercase font-bold tracking-tighter">PDF Engine Ready</p>
             </div>
          </div>
        </div>

        {/* RIGHT: APPELS D'OFFRES */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
          <div className="flex items-center gap-2 mb-1">
             <FileStack size={16} className="text-blue-500" />
             <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">Appels d'Offres</h2>
          </div>

          <div className="space-y-3">
            {appelsOffres.map((offre) => (
              <div key={offre.id} className="p-4 bg-[#111111] border border-gray-800 rounded-xl hover:border-gray-600 transition-all group">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{offre.title}</h3>
                  <Download size={14} className="text-gray-600 hover:text-white cursor-pointer" />
                </div>
                <div className="mt-3 flex items-center gap-3">
                   <span className="text-[10px] text-gray-600 font-bold">{offre.size}</span>
                   <span className="w-1 h-1 rounded-full bg-gray-800" />
                   <span className="text-[10px] text-gray-600 font-bold uppercase">{offre.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;