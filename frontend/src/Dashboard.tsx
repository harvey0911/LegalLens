import React, { useEffect, useState } from 'react';
import api from './api/axios'; // Using your custom Axios instance
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Gavel
} from 'lucide-react';

// Types for our data
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

const Dashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<DashboardStats>({ Done: 0, 'In Process': 0, Pending: 0 });
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Parallel fetching for performance
        const [statsRes, projectsRes] = await Promise.all([
          api.get('/projects/stats'),
          api.get('/projects/summary')
        ]);

        setStatsData(statsRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Mapping API data to your specific design layout
  const stats = [
    { 
        label: 'Total Cases', 
        value: statsData.Done + statsData['In Process'] + statsData.Pending, 
        icon: Gavel, 
        color: 'text-blue-500', 
        trend: 'Live' 
    },
    { 
        label: 'Active Projects', 
        value: statsData['In Process'], 
        icon: Clock, 
        color: 'text-amber-500', 
        trend: 'In Process' 
    },
    { 
        label: 'Completed', 
        value: statsData.Done, 
        icon: CheckCircle2, 
        color: 'text-green-500', 
        trend: 'Done' 
    },
    { 
        label: 'Pending Review', 
        value: statsData.Pending, 
        icon: AlertCircle, 
        color: 'text-rose-500', 
        trend: 'Pending' 
    },
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
              <span className="text-[10px] font-bold text-zinc-500 bg-zinc-500/10 px-2 py-1 rounded uppercase">
                {stat.trend}
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
        {/* Main Content: Project List */}
        <div className="lg:col-span-2 bg-[#161616] border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-white">Current Projects</h3>
             <span className="text-xs text-blue-500 cursor-pointer hover:underline">View All</span>
          </div>
          
          <div className="space-y-4">
            {projects.length === 0 && !loading && (
                <p className="text-gray-600 text-sm italic">No projects found in database.</p>
            )}
            {projects.map((project, i) => (
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

        {/* Side List: Recent Activity (Design preserved) */}
        <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { title: 'Contract Reviewed', time: '2m ago', desc: 'Audit Énergétique École A' },
              { title: 'New Case Opened', time: '1h ago', desc: 'Expertise Technique Pont B' },
              { title: 'Document Signed', time: '4h ago', desc: 'Rénovation Éclairage Public' },
              { title: 'Status Update', time: 'Yesterday', desc: 'Installation Solaire Hospitalière' },
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


// import React from 'react';
// import { 
//   BarChart3, 
//   Clock, 
//   CheckCircle2, 
//   AlertCircle, 
//   TrendingUp, 
//   ArrowUpRight,
//   Gavel
// } from 'lucide-react';

// const Dashboard: React.FC = () => {
//   const stats = [
//     { label: 'Total Cases', value: '128', icon: Gavel, color: 'text-blue-500', trend: '+12%' },
//     { label: 'Active Projects', value: '43', icon: Clock, color: 'text-amber-500', trend: '+5%' },
//     { label: 'Completed', value: '82', icon: CheckCircle2, color: 'text-green-500', trend: '+18%' },
//     { label: 'Pending Review', value: '12', icon: AlertCircle, color: 'text-rose-500', trend: '-2%' },
//   ];

//   return (
//     <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
//       {/* Welcome Header */}
//       <header className="mb-8">
//         <h1 className="text-2xl font-bold text-white mb-2">Welcome back, Counselor</h1>
//         <p className="text-gray-500 text-sm">Here is what is happening with your cases today.</p>
//       </header>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         {stats.map((stat) => (
//           <div key={stat.label} className="bg-[#161616] border border-gray-800 p-5 rounded-xl hover:border-gray-700 transition-colors">
//             <div className="flex justify-between items-start mb-4">
//               <div className={`p-2 rounded-lg bg-[#1a1a1a] border border-gray-800 ${stat.color}`}>
//                 <stat.icon size={20} />
//               </div>
//               <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
//                 {stat.trend}
//               </span>
//             </div>
//             <div>
//               <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
//               <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         <div className="lg:col-span-2 bg-[#161616] border border-gray-800 rounded-xl p-6">
          
          
//           {/* free space */}
          
//         </div>

//         {/* Side List: Recent Activity */}
//         <div className="bg-[#161616] border border-gray-800 rounded-xl p-6">
//           <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
//           <div className="space-y-6">
//             {[
//               { title: 'Contract Reviewed', time: '2m ago', desc: 'NDA for Project X' },
//               { title: 'Meeting Scheduled', time: '1h ago', desc: 'Discovery with Acme Corp' },
//               { title: 'Document Signed', time: '4h ago', desc: 'Partnership Agreement' },
//               { title: 'New Case Opened', time: 'Yesterday', desc: 'Estate Dispute #402' },
//             ].map((activity, i) => (
//               <div key={i} className="flex gap-4 relative group">
//                 <div className="z-10 w-2 h-2 rounded-full bg-zinc-700 mt-1.5 group-hover:bg-white transition-colors" />
//                 {i !== 3 && <div className="absolute left-[3px] top-4 w-[2px] h-12 bg-zinc-800" />}
//                 <div>
//                   <div className="flex justify-between items-center gap-2">
//                     <h4 className="text-sm font-bold text-gray-200">{activity.title}</h4>
//                     <span className="text-[10px] text-gray-600 whitespace-nowrap">{activity.time}</span>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-0.5">{activity.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button className="w-full mt-8 py-2 text-xs font-bold text-gray-400 border border-gray-800 rounded-lg hover:bg-[#1a1a1a] transition-colors">
//             View All Activity
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;