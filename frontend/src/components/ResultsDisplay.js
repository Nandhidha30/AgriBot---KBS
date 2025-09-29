// D:\KBS_Agriculture\frontend\src\components\ResultsDisplay.js
import React from 'react';

const ResultsDisplay = ({ diagnosis, onReset }) => {
  if (!diagnosis) return null;

  const { 
    diagnosis: diagText, 
    recommendation, 
    farmerNotes,
    certainty_factor 
  } = diagnosis;

  const rec = recommendation || {}; 

  const cfPercentage = (certainty_factor * 100).toFixed(1);
  let cfColor = 'gray';
  if (certainty_factor >= 0.8) cfColor = '#006400';
  else if (certainty_factor >= 0.5) cfColor = '#ff8c00';
  else cfColor = '#8b0000';
  
  return (
    <div style={{ padding: '25px', backgroundColor: '#f0fff0', border: '3px solid #006400', borderRadius: '12px', textAlign: 'left' }}>
      <h2 style={{ color: '#006400', borderBottom: '2px solid #006400', paddingBottom: '10px' }}>
        AgriBot KBS Result
      </h2>
      
      <h3 style={{ color: '#333', fontSize: '1.5em', marginBottom: '5px' }}>{diagText}</h3>
      
      <p style={{ fontWeight: 'bold', color: cfColor, fontSize: '1.2em', padding: '5px 0' }}>
          Certainty Factor (CF): {cfPercentage}%
      </p>
      
      <hr style={{marginBottom: '20px'}}/>

      {farmerNotes && farmerNotes.trim() && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderLeft: '3px solid #ccc', borderRadius: '5px' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#555' }}>Input Context Log:</h4>
            <p style={{ margin: 0, fontStyle: 'italic', whiteSpace: 'pre-wrap', maxHeight: '120px', overflowY: 'auto', fontSize: '0.9em' }}>{farmerNotes}</p>
        </div>
      )}

      {rec.treatment && (
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ color: '#007bff' }}>Treatment & Immediate Action:</h4>
          <p style={{ whiteSpace: 'pre-wrap', paddingLeft: '15px', borderLeft: '3px solid #007bff' }}>{rec.treatment}</p>
        </div>
      )}
      
      {rec.recovery && (
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ color: '#ff8c00' }}>Recovery & Disease Management:</h4>
          <p style={{ whiteSpace: 'pre-wrap', paddingLeft: '15px', borderLeft: '3px solid #ff8c00' }}>{rec.recovery}</p>
        </div>
      )}
      
      {rec.prevention && (
        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ color: '#32cd32' }}>Prevention & Future Strategy:</h4>
          <p style={{ whiteSpace: 'pre-wrap', paddingLeft: '15px', borderLeft: '3px solid #32cd32' }}>{rec.prevention}</p>
        </div>
      )}

      {certainty_factor < 0.1 && (
        <p style={{ color: 'darkred', fontWeight: 'bold' }}>The CF is too low for a reliable diagnosis. Review your facts carefully and try again.</p>
      )}

      <button 
        onClick={onReset} 
        style={{ padding: '12px 25px', backgroundColor: '#696969', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1em', display: 'block', width: '100%', marginTop: '20px' }}
      >
        Start New Diagnosis
      </button>
    </div>
  );
};

export default ResultsDisplay;