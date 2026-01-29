import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Projects from './Projects';
import Dashboard from './Dashboard';
import Reports from './Reports';
import Project from './Project';
import Analytics from './Analytics';
import ProjectAnalytics from './ProjectAnalytics';
function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage />}>
      {/* Home / Default View */}
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />

      {/* Projects Section */}
      <Route path="projects" element={<Projects />} />
      <Route path="projects/:id" element={<Project />} />

      {/* Analytics Section */}
      <Route path="analytics" element={<Analytics />} />
      <Route path="analytics/:id" element={<ProjectAnalytics />} />

      {/* Reports Section */}
      <Route path="reports" element={<Reports />} />
      
    </Route>
  </Routes>
</BrowserRouter>
  );
}

export default App;