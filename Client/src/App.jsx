import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/homeDashboard/Home.jsx";
import Stats from "./pages/stats/Stats";
import GameRoom from "./pages/gameRoom/GameRoutes.jsx";
import CourseRoom from "./pages/CourseRoom";
import Signout from "./Auth/Signout";
import SignUp from "./Auth/Authenticate.jsx";
import ProfileRoutes from "./pages/profileSettings/ProfileRoutes.jsx";
import PageNotFound from "../src/pages/PageNotFound";
import ProjectInfo from "../src/pages/ProjectInfo";
import StudyRoom from "./pages/Sessions/Sessions.jsx";
import OtpInput from "./Auth/Verifyotp.jsx";
import ChatRooms from "./pages/ChatRoom/Index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="study-room" element={<StudyRoom />} />
          <Route path="chat-room" element={<ChatRooms />} />
          <Route path="stats" element={<Stats />} />
          <Route path="games/*" element={<GameRoom />} />
          <Route path="course" element={<CourseRoom />} />
          <Route path="verify" element={<OtpInput />} />
          <Route path="project-details" element={<ProjectInfo />} />
          <Route path="profile/*" element={<ProfileRoutes />} />
          <Route path="authenticate" element={<SignUp />} />
          <Route path="signout" element={<Signout />} />

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
