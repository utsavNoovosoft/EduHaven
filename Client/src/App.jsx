import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home.jsx";
import Stats from "./pages/Stats";
import GameRoom from "./routes/GameRoutes.jsx";
import Signout from "./Auth/Signout";
// import SignUp from "./Auth/Authenticate.jsx";
import PageNotFound from "../src/pages/PageNotFound";
import ProjectInfo from "../src/pages/ProjectInfo";
import StudyRoom from "./pages/Sessions.jsx";
import OtpInput from "./Auth/Verifyotp.jsx";
import ProfileSettings from "./pages/ProfileSettings";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import GoogleRedirect from "./Auth/GoogleRedirect";
import Auth from "./Auth/Auth";

function App() {
  return (
    <UserProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="study-room" element={<StudyRoom />} />
            <Route path="stats" element={<Stats />} />
            <Route path="games/*" element={<GameRoom />} />
            <Route path="project-details" element={<ProjectInfo />} />
            <Route path="profile/" element={<ProfileSettings />} />
          </Route>
          <Route path="signout" element={<Signout />} />
          <Route path="verify" element={<OtpInput />} />
          {/* <Route path="authenticate" element={<SignUp />} /> */}
          <Route path="authenticate" element={<Auth />} />
          <Route path="/auth/google/callback" element={<GoogleRedirect />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProfileProvider>
  );
}

export default App;
