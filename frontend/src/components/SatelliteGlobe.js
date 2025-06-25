import "./SatelliteGlobe.css";

import Globe from 'react-globe.gl';
import { useEffect, useState } from 'react';

function SatelliteGlobe() {
  const [orbitPath, setOrbitPath] = useState([]);

  const fetchOrbitPathData = async () => {
    const response = await fetch('/TLE');
    const data = await response.json();

    setOrbitPath(data);
  };

  useEffect(() => {
    fetchOrbitPathData();
  }, []);

  return (
    <div className="globe-container">
      <Globe
        globeImageUrl="earth.jpg"
        pathsData={orbitPath}
        pathPointAlt={alt => alt[2]}
        pathColor={() => 'rgba(255, 0, 0, 1)'}
        pathStroke={5}

        pointsData={
          orbitPath.length && orbitPath[0].length
            ? [{
              lat: orbitPath[0][0][0],
              lng: orbitPath[0][0][1],
              size: orbitPath[0][0][2] + 0.1,
              color: 'blue',
              label: 'Current Satellite Position'
            }]
            : []
        }
        pointLat="lat"
        pointLng="lng"
        pointAltitude="size"
        pointColor="color"
        pointLabel="label"
      />
    </div>
  );
}

export default SatelliteGlobe;
