import React, { useState, useCallback } from 'react';
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";
import './App.css';
import ImageUploader from './components/ImageUploader';
import PredictionResults from './components/PredictionResults';
import { useFileReader } from './hooks/useFileReader';

function App() {
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const { loading, error, readFile } = useFileReader();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    readFile(file, (result) => {
      setImage(result);
     // setPredictions([]);
      handlePredict(file.name);
    });
  };

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      readFile(file, (result) => {
        setImage(result);
        setPredictions([]);
      });
    }
  }, [readFile]);

  const handlePredict = async (imageName) => {
    try {
      setIsPredicting(true);
      setPredictions([]);
      const imgElement = document.getElementById("uploaded-image");
      if (!imgElement) {
        throw new Error("Image element not found");
      }
      const model = await mobilenet.load();
      const predictions = await model.classify(imgElement);
      const highestPrediction = predictions.reduce((max, pred) => 
        pred.probability > max.probability ? pred : max, predictions[0]);
      setPredictions([highestPrediction]);
      setAllResults(prevResults => [
        { imageName, predictions: [highestPrediction] },
        ...prevResults
      ]);
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleImageClick = () => {
    document.getElementById("file-upload").click();
  };

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={()=>setIsDragging(true)}
      onDragLeave={()=>setIsDragging(false)}
      className={`drop-area ${isDragging ? 'dragging' : ''}`}
    >
       <h1>Image Recognition and Classification</h1>
      {loading && <p>Loading...</p>}
      {image && (
        <img
          id="uploaded-image"
          src={image}
          alt="Uploaded"
          className="uploaded-image"
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
        />
      )}
      <ImageUploader onImageChange={handleImageChange} onImageClick={handleImageClick} loading={isPredicting || loading}/>
      {error && (
        <div className="error-message">
          <strong>{error}</strong>
        </div>
      )}
      <PredictionResults 
        allResults={allResults} 
        loading={isPredicting || loading} 
      />
    </div>
  );
}

export default App;
