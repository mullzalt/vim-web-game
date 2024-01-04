import { Route, Routes } from "react-router-dom";
import RootLayout from "./pages/layout";
import LandingPage from "./pages/home/landing";
import NotFound from "./pages/not-found";
import { HomeLayout } from "./pages/home-layout";
import { ModuleMainPage } from "./pages/home/module-index";
import { ModuleDescPage } from "./pages/home/module-desc";
import { SandboxPage } from "./pages/home/sandbox";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="modules" element={<ModuleMainPage />} />
          <Route path="modules/:id" element={<ModuleDescPage />} />
          <Route path="sandbox" element={<SandboxPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
