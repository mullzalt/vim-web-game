import { Route, Routes } from "react-router-dom";
import RootLayout from "./pages/layout";
import LandingPage from "./pages/home/landing";
import NotFound from "./pages/not-found";
import { HomeLayout } from "./pages/home-layout";
import { ModuleMainPage } from "./pages/home/module-index";
import { ModuleDescPage } from "./pages/home/module-desc";
import { SandboxPage } from "./pages/home/sandbox";
import { ModuleAdminPage } from "./pages/admin/module-create";
import { RequiredAdmin } from "./pages/required-auth";
import { ModuleEdit } from "./pages/admin/module-edit";
import { LearnPage } from "./pages/home/learn-main";
import { LeaderBoardPage } from "./pages/home/leaderboard";
import { FeedbackPage } from "./pages/home/feedback";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="modules" element={<ModuleMainPage />} />
          <Route path="modules/:id" element={<ModuleDescPage />} />
          <Route path="sandbox" element={<SandboxPage />} />
          <Route path="leaderboard" element={<LeaderBoardPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="admin" element={<RequiredAdmin />}>
            <Route path="modules" element={<ModuleAdminPage />} />
            <Route path="modules/:id" element={<ModuleEdit />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
