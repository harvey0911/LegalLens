import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

const ProjectAnalytics: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const results = {
    accepted: [
      { id: 1, company: "TechnoBuild SA", score: "94%", reason: "Full compliance with technical specs & budget." },
      { id: 2, company: "Global Infra", score: "88%", reason: "Strong environmental certification matching CPS." }
    ],
    rejected: [
      { id: 3, company: "FastTrack Const.", reason: "Missing administrative document (Article 4.2)." },
      { id: 4, company: "BuildIt Corp", reason: "Pricing exceeds budget ceiling by 25%." },
      { id: 5, company: "Sarl Bati", reason: "Technical experience insufficient for R+4 complexity." }
    ]
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/analytics')}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Back to Analytics List
      </button>

      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white mb-2">AI Analysis Results</h1>
        <p className="text-gray-500 text-sm italic">Project ID: {id} • Model: LegalLens-LLM-v1</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ACCEPTED COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <CheckCircle2 className="text-green-500" size={20} />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Accepted Offers</h2>
            <span className="ml-auto text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
              {results.accepted.length} Valid
            </span>
          </div>
          
          {results.accepted.map(item => (
            <div key={item.id} className="bg-[#111111] border border-gray-800 rounded-xl p-5 hover:border-green-500/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-100">{item.company}</h3>
                <span className="text-xs font-black text-green-400">{item.score}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{item.reason}</p>
            </div>
          ))}
        </div>

        {/* REJECTED COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <XCircle className="text-rose-500" size={20} />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Rejected Offers</h2>
            <span className="ml-auto text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
              {results.rejected.length} Ineligible
            </span>
          </div>

          {results.rejected.map(item => (
            <div key={item.id} className="bg-[#111111] border border-gray-800 rounded-xl p-5 hover:border-rose-500/30 transition-all">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-100">{item.company}</h3>
                <AlertCircle size={14} className="text-rose-900" />
              </div>
              <div className="flex gap-2 items-start p-2 bg-rose-500/5 rounded border border-rose-500/10">
                <Info size={12} className="text-rose-500 mt-0.5" />
                <p className="text-[11px] text-rose-200/70 italic">{item.reason}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ProjectAnalytics;