// routes.tsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import PlayerPage from './pages/Player/Player';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/player/:username" element={<PlayerPage />} />
    </Routes>
  );
}
