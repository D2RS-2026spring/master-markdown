import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import Home from './pages/Home';
import Levels from './pages/Levels';
import LevelDetail from './pages/LevelDetail';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import StageComplete from './pages/StageComplete';
import Achievement from './pages/Achievement';

function App() {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="levels" element={<Levels />} />
          <Route path="levels/:id" element={<LevelDetail />} />
          <Route path="stages/:stageId/complete" element={<StageComplete />} />
          <Route path="achievement" element={<Achievement />} />
          <Route path="profile" element={<Profile />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
