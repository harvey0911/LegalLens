import React from 'react';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  ArrowUpRight,
  Gavel
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Total Cases', value: '128', icon: Gavel, color: 'text-blue-500', trend: '+12%' },
    { label: 'Active Projects', value: '43', icon: Clock, color: 'text-amber-500', trend: '+5%' },
    { label: 'Completed', value: '82', icon: CheckCircle2, color: 'text-green-500', trend: '+18%' },
    { label: 'Pending Review', value: '12', icon: AlertCircle, color: 'text-rose-500', trend: '-2%' },
  ];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, Counselor</h1>
        <p className="text-gray-500 text-sm">Here is what is happening with your cases today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[#161616] border border-gray-800 p-5 rounded-xl hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-[#1a1a1a] border border-gray-800 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-[#161616] border border-gray-800 rounded-xl p-6">
          
          
          {/* free space */}
          
        </div>

        {/* Side List: Recent Activity */}
        <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { title: 'Contract Reviewed', time: '2m ago', desc: 'NDA for Project X' },
              { title: 'Meeting Scheduled', time: '1h ago', desc: 'Discovery with Acme Corp' },
              { title: 'Document Signed', time: '4h ago', desc: 'Partnership Agreement' },
              { title: 'New Case Opened', time: 'Yesterday', desc: 'Estate Dispute #402' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 relative group">
                <div className="z-10 w-2 h-2 rounded-full bg-zinc-700 mt-1.5 group-hover:bg-white transition-colors" />
                {i !== 3 && <div className="absolute left-[3px] top-4 w-[2px] h-12 bg-zinc-800" />}
                <div>
                  <div className="flex justify-between items-center gap-2">
                    <h4 className="text-sm font-bold text-gray-200">{activity.title}</h4>
                    <span className="text-[10px] text-gray-600 whitespace-nowrap">{activity.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-xs font-bold text-gray-400 border border-gray-800 rounded-lg hover:bg-[#1a1a1a] transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;