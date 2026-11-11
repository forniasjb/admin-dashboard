import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import ReportGeneration from './pages/ReportGeneration';
import Users from './pages/Users';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// A data router (instead of <BrowserRouter>) is required for useBlocker, which powers the
// unsaved-changes warning on Back/Forward. Routes are still declared with <Route>.
const router = createBrowserRouter(
  createRoutesFromElements(
    // Every page renders inside <Layout /> through its <Outlet />
    <Route element={<Layout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/report-generation" element={<ReportGeneration />} />
      <Route path="/users" element={<Users />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default function App() {
  return <RouterProvider router={router} />;
}
