import "./App.css";

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Apod from "./components/Apod";
import SatelliteGlobe from "./components/SatelliteGlobe";
import Header from "./components/Header";

function App() {

  return (
    <Router>
      <Header />
      <nav>
        <Link to="/">APOD</Link>
        <Link to="/satellite">Satellite Orbit</Link>
      </nav>
      <Routes>
        <Route path="/" element={ <Apod /> } />
        <Route path="/satellite" element={ <SatelliteGlobe /> } />
        <Route path="*" element={ <div>404 Not Found</div> } />
      </Routes>
    </Router>
  );
}

export default App;
