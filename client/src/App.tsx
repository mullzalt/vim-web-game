import { Route, Routes } from "react-router-dom";
import RootLayout from "./pages/layout";
import LandingPage from "./pages/home/landing";
import NotFound from "./pages/not-found";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
