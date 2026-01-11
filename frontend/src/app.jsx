import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Profile from "./components/pages/Profile";
import BottomNavigation from "./components/navigations/BottomNavigation";

function App() {
  return (
    <BrowserRouter>
      {" "}
      <div className="min-h-screen bg-gray-50 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        <BottomNavigation />
      </div>
    </BrowserRouter>
  );
}

export default App;
