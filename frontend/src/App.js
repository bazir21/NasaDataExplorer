import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [ApodData, setApodData] = useState(null);

  useEffect(() => {
    fetch("/APOD")
      .then(response => response.json())
      .then(data => {
        setApodData(data);
      })
      .catch(error => {
        console.error("Error fetching APOD data:", error);
      });
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
