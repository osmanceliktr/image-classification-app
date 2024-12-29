import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

function ImageUploader({ onImageChange, loading }) {
  return (
    <div className="button-group">
      <label htmlFor="file-upload" className="file-upload-label">
        {loading ? "Analyzing..." : <><FontAwesomeIcon icon={faUpload} /> Select File</>}
      </label>
      <input id="file-upload" type="file" accept="image/*" onChange={onImageChange} />
    </div>
  );
}

export default ImageUploader; 