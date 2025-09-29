// D:\KBS_Agriculture\frontend\src\components\ImageUpload.js
import React, { useState } from 'react';

const ImageUpload = ({ onProceed }) => {
    const [imageFile, setImageFile] = useState(null);
    const [simulatedSymptoms, setSimulatedSymptoms] = useState([]);
    
    const handleProceed = () => {
        let notes = imageFile ? `[Image: ${imageFile.name} uploaded and reviewed by user.] ` : `[No Image Uploaded] `;
        notes += "Proceeding to conversational fact-finding.";
        
        onProceed({ symptoms: simulatedSymptoms, farmerNotes: notes });
    };

    return (
        <div className="symptom-form-container">
            <div className="step-indicator">STEP 1 / 3: Image Review</div>
            <h2>Input: Initial Visual Facts</h2>
            
            <p style={{ color: '#555', borderLeft: '3px solid #ccc', paddingLeft: '10px' }}>
                *AgriBot asks you to check the clearest visual facts to begin the diagnostic process.*
            </p>
            
            <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files[0])}
                style={{ marginBottom: '20px', display: 'block', margin: '15px auto' }}
            />
            
            {imageFile && (
                <div style={{ marginBottom: '25px', padding: '15px', border: '1px dashed #006400', borderRadius: '5px', textAlign: 'left' }}>
                    <p style={{ fontWeight: 'bold' }}>Visual Fact Checklist:</p>
                    <label style={{ marginRight: '20px' }} className="checkbox-item">
                        <input type="checkbox" onChange={(e) => setSimulatedSymptoms(prev => e.target.checked ? [...prev, 'leaves_yellow_upper'] : prev.filter(s => s !== 'leaves_yellow_upper'))} /> Yellowing Upper Leaves (New Growth)
                    </label>
                    <label className="checkbox-item">
                        <input type="checkbox" onChange={(e) => setSimulatedSymptoms(prev => e.target.checked ? [...prev, 'leaves_brown_lower'] : prev.filter(s => s !== 'leaves_brown_lower'))} /> Browning Lower Leaves
                    </label>
                </div>
            )}
            
            <button 
                onClick={handleProceed}
                style={{ padding: '12px 25px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1em' }}
            >
                Proceed to Conversational Fact-Finding
            </button>
        </div>
    );
};

export default ImageUpload;