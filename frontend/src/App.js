import "./App.css";

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Apod from "./components/Apod";
import SatelliteGlobe from "./components/SatelliteGlobe";
import Header from "./components/Header";

function App() {

  return (
    <Router>
      <div className="Router-container">
        <Header />
        <nav className="nav-links">
          <ul>
            <li><Link to="/">APOD</Link></li>
            <li><Link to="/satellite">Satellite Orbit</Link></li>
          </ul>
        </nav>
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Apod />} />
            <Route path="/satellite" element={<SatelliteGlobe />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
