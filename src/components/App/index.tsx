import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "../../routes/Home/HomePage";
import SingleplayerPage from "../../routes/Singleplayer/SinglePlayerPage";
import MultiplayerPage from "../../routes/Multiplayer/MultiplayerPage";
import NotFoundPage from "../../routes/404/NotFoundPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/play" element={<SingleplayerPage />} />
        <Route path="/room/:roomId" element={<MultiplayerPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
