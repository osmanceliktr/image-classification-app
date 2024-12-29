import React from 'react';
import { getPredictionCategory,calculateOverallRecognitionSuccess } from '../utils/helpers';

function PredictionResults({ allResults, loading }) {
  return (
    <>
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Analyzing Image...</p>
        </div>
      ) :(<></>)}
      {(
        allResults.length > 0 && (
          <div className="prediction-result">
            <div className="result-header">
              <h3>Results:</h3>
              <p>Recognition Success: % {calculateOverallRecognitionSuccess(allResults).toFixed(2)}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Image Name</th>
                  <th>Class</th>
                  <th>Prediction Probability</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {allResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.imageName}</td>
                    <td>{result.predictions[0].className}</td>
                    <td>% {(result.predictions[0].probability * 100).toFixed(2)}</td>
                    <td>{getPredictionCategory(result.predictions[0].probability)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </>
  );
}

export default PredictionResults; 