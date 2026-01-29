import React, { useState } from 'react';
// Removed GripVertical from this line to fix the error
import { Search, ListFilter, Plus, FileText, Download } from 'lucide-react';

interface Report {
  id: number;
  name: string;
  dateGenerated: string;
  fileSize: string;
}

const INITIAL_DATA: Report[] = [
  { id: 1, name: 'Q4 Legal Compliance Audit', dateGenerated: '2025-12-15', fileSize: '2.4 MB' },
  { id: 2, name: 'Internal Risk Assessment', dateGenerated: '2025-11-20', fileSize: '1.8 MB' },
  { id: 3, name: 'Quarterly Litigation Summary', dateGenerated: '2025-10-05', fileSize: '3.1 MB' },
  { id: 4, name: 'Employee Contract Review - Final', dateGenerated: '2025-09-12', fileSize: '1.2 MB' },
  { id: 5, name: 'GDPR Compliance Gap Analysis', dateGenerated: '2025-08-28', fileSize: '4.5 MB' },
];

const Reports: React.FC = () => {
  const [reports] = useState<Report[]>(INITIAL_DATA);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredReports = reports.filter((report) =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full animate-in fade-in duration-500 bg-[#0f0f0f]">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-8 gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search reports..."
            className="block w-full bg-[#111111] border border-gray-800 rounded-md py-2 pl-10 pr-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-700 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 shrink-0">
          <button className="flex items-center gap-2 bg-[#111111] border border-gray-800 px-3 py-2 rounded-md hover:bg-[#1a1a1a] transition text-gray-400">
            <ListFilter size={16} />
            <span className="text-sm font-medium whitespace-nowrap">Filter</span>
          </button>
          
         
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-hidden rounded-lg border border-gray-800 bg-[#0f0f0f]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-gray-500 text-[10px] uppercase tracking-[0.1em] bg-[#111111]/50">
              <th className="p-4 w-10"></th>
              <th className="p-4 font-bold">Report Name</th>
              <th className="p-4 font-bold text-center">Date Generated</th>
              <th className="p-4 font-bold text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/40">
            {filteredReports.map((report) => (
              <tr key={report.id} className="hover:bg-[#141414] group transition-colors">
                <td className="p-4 w-10 text-center">
                  <FileText size={16} className="mx-auto text-gray-600 group-hover:text-white transition-colors" />
                </td>
                <td className="p-4 font-medium text-gray-200 text-sm">
                  {report.name}
                  <p className="text-[10px] text-gray-600 font-bold mt-0.5 uppercase tracking-tight">{report.fileSize}</p>
                </td>
                <td className="p-4 text-center text-gray-500 text-xs tabular-nums">
                  {report.dateGenerated}
                </td>
                <td className="p-4 text-right pr-8">
                  <button className="p-2 rounded-md text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all">
                    <Download size={16} />
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

export default Reports;