import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Generator } from './pages/Generator';
import { Pinboard } from './pages/Pinboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<Generator />} />
            <Route path="/pinboard" element={<Pinboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;