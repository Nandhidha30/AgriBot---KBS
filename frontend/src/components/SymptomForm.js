// D:\KBS_Agriculture\frontend\src\components\SymptomForm.js
import React, { useState, useEffect } from 'react';

const SymptomForm = ({ onDiagnose, loading, error, initialSelectedSymptoms = [], initialNotes = "" }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState(initialSelectedSymptoms); 
  const [farmerNotes, setFarmerNotes] = useState(initialNotes || ""); 
  const [fetchError, setFetchError] = useState(null); 

  useEffect(() => {
    const fetchSymptoms = async () => {
      setFetchError(null); 
      try {
        const response = await fetch('http://localhost:5000/api/symptoms');
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        const data = await response.json();
        setSymptoms(data);
      } catch (e) {
        setFetchError("Connection Error: AgriBot backend (port 5000) is unreachable.");
      }
    };
    fetchSymptoms();
  }, []); 

  const handleCheckboxChange = (key) => {
    // Prevent unchecking facts acquired in previous steps for data integrity
    if (initialSelectedSymptoms.includes(key)) {
        alert("This fact was acquired via Image/Chat and cannot be unchecked in the final review.");
        return;
    }
    
    setSelectedSymptoms(prev => 
      prev.includes(key)
        ? prev.filter(s => s !== key)
        : [...prev, key]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSymptoms.length > 0) {
      onDiagnose({ symptoms: selectedSymptoms, farmerNotes: farmerNotes }); 
    } else {
      alert("Please select at least one symptom.");
    }
  };

  let formContent;

  if (fetchError) {
    formContent = (
      <div style={{ padding: '15px', border: '1px solid red', color: 'red', backgroundColor: '#fee', borderRadius: '5px' }}>
        <p><strong>Connection Error:</strong> {fetchError}</p>
        <p style={{ fontSize: '12px' }}>*Please ensure your Flask server is running.*</p>
      </div>
    );
  } else if (symptoms.length === 0) {
    formContent = <p>Loading knowledge base definitions...</p>;
  } else {
    formContent = (
      <div className="symptom-grid">
        {symptoms.map(symptom => {
          const isAcquiredFact = initialSelectedSymptoms.includes(symptom.key);
          const isChecked = selectedSymptoms.includes(symptom.key);
          
          return (
            <label 
              key={symptom.key} 
              className="checkbox-item" 
              style={{ backgroundColor: isChecked ? '#ccffcc' : 'white', opacity: isAcquiredFact ? 0.8 : 1 }}
            >
              <input
                type="checkbox"
                name={symptom.key}
                checked={isChecked}
                onChange={() => handleCheckboxChange(symptom.key)}
                disabled={isAcquiredFact}
              />
              {symptom.label}
              {isAcquiredFact && <span style={{ color: '#006400', marginLeft: '5px', fontWeight: 'bold' }}> (Acquired Fact)</span>}
            </label>
          );
        })}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="symptom-form-container">
      <div className="step-indicator">STEP 3 / 3: Final Review & Inference</div>
      <h2>Final Fact Validation (AgriBot Input)</h2>
      <p style={{ color: '#8b0000', fontWeight: 'bold' }}>The checklist below contains all facts, including those acquired from the Image/Chat steps. Review and add any remaining facts.</p>
      
      {error && <p style={{ color: 'red' }}>Diagnosis API Error: {error}</p>}
      
      {formContent}

      <h2 style={{marginTop: '30px'}}>Context: Farmer's Final Notes</h2>
      <textarea
        className="farmer-notes-box"
        placeholder="Includes notes from previous steps. Add final context here..."
        value={farmerNotes}
        onChange={(e) => setFarmerNotes(e.target.value)}
      ></textarea>

      <button 
        type="submit" 
        disabled={loading || selectedSymptoms.length === 0} 
        style={{ padding: '12px 25px', cursor: 'pointer', marginTop: '30px', backgroundColor: '#8b0000', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2em' }}
      >
        {loading ? 'Running KBS Inference...' : 'Run AgriBot Diagnosis'}
      </button>
      
      <div style={{ marginTop: '15px', fontSize: '1em', color: '#333' }}>
        Total Facts/Symptoms for Inference: <strong>{selectedSymptoms.length}</strong>
      </div>
    </form>
  );
};

export default SymptomForm;