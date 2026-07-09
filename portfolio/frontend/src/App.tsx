import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EntryScreen from './pages/EntryScreen';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Resume from './pages/Resume';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        <Routes>
          <Route path="/" element={<EntryScreen />} />
          <Route path="/home" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
