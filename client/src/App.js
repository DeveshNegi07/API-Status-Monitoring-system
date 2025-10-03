import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Analysis from "./pages/analysis/Analysis";
import Home from "./pages/home/Home";
import Tracer from "./pages/tracer/Tracer";
import Configuration from "./pages/configuration/Configuration";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tracer" element={<Tracer />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/configuration" element={<Configuration />} />
      </Routes>
    </Router>
  );
}

export default App;
