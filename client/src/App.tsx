import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import { Expeditions, ExpeditionDetail } from './pages/Expeditions';
import { Datasets, DatasetDetail } from './pages/Datasets';
import { Publications, PublicationDetail, Media, News } from './pages/Research';
import { MapExplorer, TimeMachine, KnowledgeGraph } from './pages/MapTimeGraph';
import AI from './pages/AI';
import { Education, VirtualExpedition } from './pages/EducationVirtual';
import { Login, Dashboard } from './pages/AuthDashboard';
import { ResearcherDashboard } from './pages/ResearcherDashboard';
import { ReviewerDashboard } from './pages/ReviewerDashboard';
import { MediaManagerDashboard } from './pages/MediaManagerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import Discover from './pages/Discover';
import PlatformLab from './pages/PlatformLab';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/expeditions" element={<Expeditions />} />
        <Route path="/expeditions/:id" element={<ExpeditionDetail />} />
        <Route path="/map" element={<MapExplorer />} />
        <Route path="/datasets" element={<Datasets />} />
        <Route path="/datasets/:id" element={<DatasetDetail />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/publications/:id" element={<PublicationDetail />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/media" element={<Media />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/education" element={<Education />} />
        <Route path="/news" element={<News />} />
        <Route path="/time-machine" element={<TimeMachine />} />
        <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
        <Route path="/virtual-expedition" element={<VirtualExpedition />} />

        {/* Protected Role-Based Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher"
          element={
            <ProtectedRoute allowedRoles={['researcher_scientist', 'ncpor_admin', 'RESEARCHER', 'PLATFORM_ADMIN']}>
              <ResearcherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer"
          element={
            <ProtectedRoute allowedRoles={['researcher_scientist', 'ncpor_admin', 'SCIENTIFIC_REVIEWER', 'PLATFORM_ADMIN']}>
              <ReviewerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/media-manager"
          element={
            <ProtectedRoute allowedRoles={['media_content', 'ncpor_admin', 'MEDIA_MANAGER', 'PLATFORM_ADMIN']}>
              <MediaManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ncpor_admin', 'PLATFORM_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/platform" element={<PlatformLab />} />
        <Route path="*" element={<Explore />} />
      </Routes>
    </Layout>
  );
}
