import "./SatelliteGlobe.css";

import Globe from 'react-globe.gl';
import { useEffect, useState } from 'react';

function SatelliteGlobe() {
  const [satelliteData, setSatelliteData] = useState([]);

  const fetchSatelliteData = async () => {
      const response = await fetch('/TLE');
      const data = await response.json();
      setSatelliteData(data);
    };

  useEffect(() => {
    fetchSatelliteData();
  }, []);

  return (
    <div className="globe-container">
      <Globe
        globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
        arcsData={satelliteData}
        arcColor="color"
        arcAltitude="altitude"
      />
    </div>
  );
}

export default SatelliteGlobe;
