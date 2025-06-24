import "./SatelliteGlobe.css";

import Globe from 'react-globe.gl';
import { useEffect, useState } from 'react';

function SatelliteGlobe() {
  const [orbitPath, setOrbitPath] = useState([]);

  const fetchOrbitPathData = async () => {
    const response = await fetch('/TLE');
    const data = await response.json();
    setOrbitPath(data);
    console.log("Orbit Path Data:", data);
  };

  useEffect(() => {
    fetchOrbitPathData();
  }, []);

  return (
    <div className="globe-container">
      <Globe
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-day.jpg"
        pathsData={orbitPath}
        pathColor={() => 'rgba(255, 0, 0, 1)'}
        pathStroke={5}
      />
    </div>
  );
}

export default SatelliteGlobe;
