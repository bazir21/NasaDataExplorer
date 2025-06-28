import "./Apod.css";
import { useState, useEffect } from "react";
import { StarField } from "starfield-react";
import { MoonLoader } from "react-spinners";
import { BsQuestionCircle } from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import { Tooltip } from "react-tooltip";

function Apod() {
  const [ApodData, setApodData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const fetchApodData = async (date = null) => {
    try {
      setIsLoading(true);
      setApodData(null);
      const response = await fetch(date ? `/APOD?date=${date}` : "/APOD");
      const data = await response.json();
      setApodData(data);
    } catch (error) {
      console.error("Error fetching APOD data:", error);

      try {
        const defaultResponse = await fetch("defaultAPOD.json");
        const defaultData = await defaultResponse.json();
        setApodData(defaultData);
        toast.error("Failed to fetch APOD data\nDisplaying default image");
      } catch (defaultError) {
        console.error("Error fetching default APOD data:", defaultError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApodData();
  }, []);

  return (
    <div className="App">
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
        <BsQuestionCircle className="info-icon"/>
        <Tooltip
          anchorSelect=".info-icon"
          style={{ backgroundColor: "rgb(255, 255, 255)", color: "black", maxWidth: 300}}
        >
          This page shows the Astronomy Picture of the Day (APOD) provided by NASA, with a date selector so you can check what the APOD was on a previous day
        </Tooltip>
      </div>
      <StarField
        className="starfield"
        numStars={100}
        speed={1}
        fps={60}
        depth={1000}
        fade={true}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <div className="APOD">
        {isLoading ? (
          <div className="spinner-container">
            <MoonLoader color="white" size={100} />
          </div>
        ) : ApodData ? (
          <div>
            <h1 className="APOD-title">
              {ApodData.title}
            </h1>
            <input
              className="APOD-date"
              type="date"
              min="2014-01-01"
              max={today}
              defaultValue={selectedDate}
              onChange={(e) => {
                fetchApodData(e.target.value);
                setSelectedDate(e.target.value)
              }
              }
            />
            <img
              className="APOD-image"
              src={ApodData.url}
              alt={ApodData.title}
              onLoad={() => setIsLoading(false)}
            />
            <p className="APOD-desc">{ApodData.explanation}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Apod;
