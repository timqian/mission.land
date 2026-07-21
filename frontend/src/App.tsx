import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import MissionBoard from "./pages/MissionBoard";
import LeaderBoard from "./pages/LeaderBoard";
import MissionDetail from "./pages/MissionDetail";
import UserProfile from "./pages/UserProfile";
import { langFromPath, withLang } from "./lib/i18n";
import { SoundProvider } from "./lib/sound";

function RedirectQuestToM() {
  const { num } = useParams();
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  return <Navigate to={withLang(`/m/${num}`, lang)} replace />;
}

export default function App() {
  return (
    <SoundProvider>
      <Routes>
        <Route path="/" element={<MissionBoard />} />
        <Route path="/zh" element={<MissionBoard />} />
        <Route path="/ja" element={<MissionBoard />} />
        <Route path="/ko" element={<MissionBoard />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path="/zh/leaderboard" element={<LeaderBoard />} />
        <Route path="/ja/leaderboard" element={<LeaderBoard />} />
        <Route path="/ko/leaderboard" element={<LeaderBoard />} />
        <Route path="/leaderboard/:board" element={<LeaderBoard />} />
        <Route path="/zh/leaderboard/:board" element={<LeaderBoard />} />
        <Route path="/ja/leaderboard/:board" element={<LeaderBoard />} />
        <Route path="/ko/leaderboard/:board" element={<LeaderBoard />} />
        <Route path="/m/:num" element={<MissionDetail />} />
        <Route path="/zh/m/:num" element={<MissionDetail />} />
        <Route path="/ja/m/:num" element={<MissionDetail />} />
        <Route path="/ko/m/:num" element={<MissionDetail />} />
        <Route path="/u/:handle" element={<UserProfile />} />
        <Route path="/zh/u/:handle" element={<UserProfile />} />
        <Route path="/ja/u/:handle" element={<UserProfile />} />
        <Route path="/ko/u/:handle" element={<UserProfile />} />
        <Route path="/quest/:num" element={<RedirectQuestToM />} />
        <Route path="/zh/quest/:num" element={<RedirectQuestToM />} />
        <Route path="/ja/quest/:num" element={<RedirectQuestToM />} />
        <Route path="/ko/quest/:num" element={<RedirectQuestToM />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SoundProvider>
  );
}
