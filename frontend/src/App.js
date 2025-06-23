import "./App.css";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [ApodData, setApodData] = useState(null);

  const fetchApodData = async (date = null) => {
    try {
      const response = await fetch(date ? `/APOD?date=${date}` : "/APOD");
      const data = await response.json();
      setApodData(data);
    } catch (error) {
      console.error("Error fetching APOD data:", error);

      try {
        const defaultResponse = await fetch("defaultAPOD.json");
        const defaultData = await defaultResponse.json();
        setApodData(defaultData);
        toast.error("Failed to fetch APOD data. Displaying default image.");
      } catch (defaultError) {
        console.error("Error fetching default APOD data:", defaultError);
      }
    }
  };

  useEffect(() => {
    fetchApodData();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="App">
      <Toaster duration={5000} position="bottom-center" reverseOrder={true} />
      <div className="APOD">
        {ApodData && (
        <div>
          <h1 className="APOD-title">
            {ApodData.title}
            <input className="APOD-date" type="date" min="2014-01-01" max={today} onChange={(e) => fetchApodData(e.target.value)} />
          </h1>
          <img className="APOD-image" src={ApodData.url} alt={ApodData.title} />
          <p>{ApodData.explanation}</p>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
