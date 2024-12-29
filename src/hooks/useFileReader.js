import { useState } from 'react';

export function useFileReader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const readFile = (file, onLoadCallback) => {
    if (file) {
      const reader = new FileReader();
      setLoading(true);
      reader.onload = () => {
        onLoadCallback(reader.result);
        setLoading(false);
      };
      reader.onerror = () => {
        setError("The file could not be read.");
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please select a file.");
    }
  };

  return { loading, error, readFile };
} 