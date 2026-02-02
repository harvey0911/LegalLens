import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api/axios';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

const ProjectAnalytics: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{ accepted: any[], rejected: any[] }>({
    accepted: [],
    rejected: []
  });

  useEffect(() => {
    const fetchRealOffers = async () => {
      try {
        setLoading(true);
        // Fetching the real offers linked to this project from your new backend route
        const response = await api.get(`/projects/${id}/offers`);
        const allOffers = response.data;

        /**
         * LOGIC BRIDGE:
         * Since we don't have AI results in the DB yet, we categorize them 
         * based on their status or a mock condition so you can see your DB data.
         */
        const accepted = allOffers.filter((o: any) => o.status === 'Accepted' || o.id.includes('1b23'));
        const rejected = allOffers.filter((o: any) => !accepted.includes(o));

        setResults({
          accepted: accepted.map((o: any) => ({
            id: o.id,
            company: o.offre_reference || "Unknown Entity",
            score: "94%", // Placeholder until AI is ready
            reason: "Full compliance with technical specs found in database."
          })),
          rejected: rejected.map((o: any) => ({
            id: o.id,
            company: o.offre_reference || "Unknown Entity",
            reason: "Initial database check: Documentation incomplete or pending AI review."
          }))
        });
      } catch (err) {
        console.error("Error fetching analysis:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRealOffers();
  }, [id]);

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-blue-500" size={32} />
    </div>
  );

  return (
    <div className="w-full animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/analytics')}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Back to Analytics List
      </button>

      <div className="mb-10 text-left">
        <h1 className="text-2xl font-bold text-white mb-2">AI Analysis Results</h1>
        <p className="text-gray-500 text-sm italic">Project ID: {id} • Source: Real-time Database</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ACCEPTED COLUMN */}
        <div className="space-y-4 text-left">
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
        <div className="space-y-4 text-left">
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