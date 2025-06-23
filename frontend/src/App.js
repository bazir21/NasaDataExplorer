import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [ApodData, setApodData] = useState(null);

  const fetchApodData = async (date = null) => {
    try {
      const response = await fetch(date ? `/APOD?date=${date}` : "/APOD");
      const data = await response.json();
      setApodData(data);
    } catch (error) {
      console.error("Error fetching APOD data:", error);
    }
  };

  useEffect(() => {
    fetchApodData();
  }, []);

  return (
    <div className="App">
      <div className="APOD">
        {ApodData && (
        <div>
          <h1>{ApodData.title}</h1>
          <img className="APOD-image" src={ApodData.url} alt={ApodData.title} />
          <p>{ApodData.explanation}</p>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
