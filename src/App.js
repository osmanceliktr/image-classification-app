import React, { useState, useCallback, useEffect } from 'react';
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";
import './App.css';
import ImageUploader from './components/ImageUploader';
import PredictionResults from './components/PredictionResults';
import { useFileReader } from './hooks/useFileReader';
import imageFile from './images/image.png';
function App() {
  const [image, setImage] = useState('');
  const [fileName, setFileName] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const { loading, error, readFile } = useFileReader();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name); 
    readFile(file, (result) => {
      setImage(result);
      setPredictions([]);
    });
  };
  useEffect(() => {
    if (image) {
      const timeoutId = setTimeout(() => {
        const imgElement = document.getElementById("uploaded-image");
        if (imgElement) {
          handlePredict(imgElement.src);
        }
      }, 100); // 100ms bekleme süresi
      return () => clearTimeout(timeoutId);
    }
  }, [image]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      readFile(file, (result) => {
        setImage(result);
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
        { imageName:fileName, predictions: [highestPrediction] },
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
    <>
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
      {!image && (
        <img
          id="uploaded-image"
          src={imageFile}
          alt="Uploaded"
          className="uploaded-image"
          onClick={handleImageClick}
          style={{ cursor: 'pointer' }}
        />
      )}
      <ImageUploader onImageChange={handleImageChange} loading={isPredicting || loading}/>
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
      <footer>
      <p>Developed by Osman Çelik - <a href="https://osmancelik.tr">osmancelik.tr</a></p>
      </footer>
    </>
  );
}

export default App;
