import "./SatelliteGlobe.css";

import Globe from "react-globe.gl";
import { useEffect, useState } from "react";

function SatelliteGlobe() {
  const [orbitPath, setOrbitPath] = useState([]);
  const [globeWindowHeight, setGlobeWindowHeight] = useState(0);
  const [selectedSatellite, setSelectedSatellite] = useState("SWISSCUBE");

  const fetchOrbitPathData = async () => {
    const response = await fetch(`/TLE?satelliteName=${selectedSatellite}`);
    const data = await response.json();

    setOrbitPath(data);
    console.log("Orbit Path Data:", data);
  };

  useEffect(() => {
    setGlobeWindowHeight(window.innerHeight - 130);
  }, []);

  useEffect(() => {
    fetchOrbitPathData();
  }, []);

  useEffect(() => {
    fetchOrbitPathData(selectedSatellite);
  }, [selectedSatellite]);

  return (
    <div className="globe-container">
      <Globe
        globeImageUrl="earth.jpg"
        height={globeWindowHeight}
        pathsData={orbitPath}
        pathPointAlt={alt => alt[2]}
        pathColor={() => "rgba(255, 0, 0, 1)"}
        pathStroke={5}

        pointsData={
          orbitPath.length && orbitPath[0].length
            ? [{
              lat: orbitPath[0][0][0],
              lng: orbitPath[0][0][1],
              size: orbitPath[0][0][2] + 0.1,
              color: "blue",
              label: "Current Satellite Position"
            }]
            : []
        }
        pointLat="lat"
        pointLng="lng"
        pointAltitude="size"
        pointColor="color"
        pointLabel="label"
      />

      <div className="satellite-selector">
        <button onClick={() => setSelectedSatellite("SWISSCUBE")}>SWISSCUBE</button>
        <button onClick={() => setSelectedSatellite("ISS (ZARYA)")}>ISS (ZARYA)</button>
        <button onClick={() => setSelectedSatellite("LANDSAT 9")}>LANDSAT 9</button>
      </div>
    </div>
  );
}

export default SatelliteGlobe;
