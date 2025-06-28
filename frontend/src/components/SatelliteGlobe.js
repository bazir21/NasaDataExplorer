import "./SatelliteGlobe.css";

import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { BsQuestionCircle } from "react-icons/bs";
import Globe from "react-globe.gl";
import toast, { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";

function SatelliteGlobe() {
  const [orbitPath, setOrbitPath] = useState([]);
  const [selectedSatellite, setSelectedSatellite] = useState("SWISSCUBE");
  const [isLoading, setIsLoading] = useState(false);
  const [globeWindowDimensions, setglobeWindowDimensions] = useState({
    height: window.innerHeight - 130,
    width: window.innerWidth,
  });

  useEffect(() => {
    const resizeGlobe = () => {
      setglobeWindowDimensions({
        height: window.innerHeight - 130,
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", resizeGlobe);
    return () => window.removeEventListener("resize", resizeGlobe)
  }, []);

  useEffect(() => {
    const fetchOrbitPathData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/TLE?satelliteName=${selectedSatellite}`);
        const data = await response.json();

        setOrbitPath(data);
        console.log("Orbit Path Data:", data);
      } catch (e) {
        console.log("Error fetching orbit path data: ", e)
        toast.error("Failed to fetch orbit path data");
        setOrbitPath([]);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchOrbitPathData(selectedSatellite);
  }, [selectedSatellite]);

  return (
    <div className="globe-container">
      <Toaster
        duration={5000}
        position="bottom-center"
        reverseOrder={true}
        toastOptions={{
          error: {
            style: {
              background: "#c62828",
              color: "#fff"
            }
          }
        }}
      />
      <div className="info-container">
        <BsQuestionCircle className="info-icon" />
        <Tooltip
          anchorSelect=".info-icon"
          style={{ backgroundColor: "rgb(255, 255, 255)", color: "black" }}
        >
          This visualisation shows the real-time position and orbit path of a certain satellite
        </Tooltip>
      </div>
      <Globe
        globeImageUrl="earth.jpg"
        height={globeWindowDimensions.height}
        width={globeWindowDimensions.width}

        {...(!isLoading ? {
          pathsData: orbitPath,
          pathPointAlt: alt => alt[2],
          pathColor: () => "rgba(255, 0, 0, 1)",
          pathStroke: 5,

          pointsData:
            orbitPath.length && orbitPath[0].length
              ? [{
                lat: orbitPath[0][0][0],
                lng: orbitPath[0][0][1],
                size: orbitPath[0][0][2] + 0.01,
                color: "blue",
                label: "Current Satellite Position"
              }]
              : [],
          pointLat: "lat",
          pointLng: "lng",
          pointAltitude: "size",
          pointColor: "color",
          pointLabel: "label",

          labelsData:
            orbitPath.length && orbitPath[0].length
              ? [{
                lat: orbitPath[0][0][0],
                lng: orbitPath[0][0][1],
                size: orbitPath[0][0][2] + 0.011,
                text: selectedSatellite
              }]
              : [],
          labelLat: "lat",
          labelLng: "lng",
          labelAltitude: "size",
          labelSize: 2,
          labelDotRadius: 0.3,
          labelColor: () => "rgba(255, 255, 255, 1)",
          labelResolution: 2
        } : {
          pointsData: [],
          pathsData: [],
          labelsData: []
        })}
      />

      <div className={`spinner-container ${isLoading ? "visible" : ""}`}>
        <SyncLoader color="white" size={20} />
      </div>

      <div className="satellite-selector">
        <button onClick={() => setSelectedSatellite("SWISSCUBE")}>SWISSCUBE</button>
        <button onClick={() => setSelectedSatellite("ISS (ZARYA)")}>ISS (ZARYA)</button>
        <button onClick={() => setSelectedSatellite("LANDSAT 9")}>LANDSAT 9</button>
        <button onClick={() => setSelectedSatellite("HST")}>HST</button>
        <button onClick={() => setSelectedSatellite("NAVSTAR 84 (USA 545)")}>NAVSTAR 84 (USA 545)</button>
        <button onClick={() => setSelectedSatellite("IRIDIUM 116")}>IRIDIUM 116</button>
        <button onClick={() => setSelectedSatellite("NOAA 19")}>NOAA 19</button>
        <button onClick={() => setSelectedSatellite("CENTAURI-1")}>CENTAURI-1</button>
      </div>
    </div>
  );
}

export default SatelliteGlobe;
