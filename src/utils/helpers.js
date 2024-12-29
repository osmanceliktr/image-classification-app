export const getPredictionCategory = (probability) => {
    if (probability > 0.85) {
      return "Definitive Diagnosis";
    } else if (probability > 0.6) {
      return "Probable Diagnosis";
    } else {
      return "Uncertain";
    }
  };
  

export const calculateOverallRecognitionSuccess = (allResults) => {
  if (allResults.length === 0) return 0;
  const totalPredictions = allResults.reduce((acc, result) => acc + result.predictions.length, 0);
  const successfulPredictions = allResults.reduce((acc, result) => {
    return acc + result.predictions.filter(pred => pred.probability > 0.6).length;
  }, 0);
  return (successfulPredictions / totalPredictions) * 100;
}; 