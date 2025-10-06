import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BulkPrediction from "./pages/BulkPrediction";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bulk" element={<BulkPrediction />} />
      </Routes>
    </Router>
  );
}
