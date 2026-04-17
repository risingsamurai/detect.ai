import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout
import PageLayout from './components/layout/PageLayout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NewAudit from './pages/NewAudit';
import AuditReport from './pages/AuditReport';
import Playground from './pages/Playground';
import Compare from './pages/Compare';
import Settings from './pages/Settings';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* Protected Routes (using Layout) */}
        <Route element={<PageLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/audit/new" element={<NewAudit />} />
          <Route path="/audit/:id" element={<AuditReport />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
