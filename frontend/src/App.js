// D:\KBS_Agriculture\frontend\src\App.js
import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ChatPanel from './components/ChatPanel';
import SymptomForm from './components/SymptomForm';
import ResultsDisplay from './components/ResultsDisplay';
import './App.css';

const STEPS = {
  INITIAL_INPUT: 'initial_input',
  CONVERSATION: 'conversation',
  SYMPTOM_REVIEW: 'symptom_review',
  RESULTS: 'results',
};

function App() {
  const [step, setStep] = useState(STEPS.INITIAL_INPUT);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collectedFacts, setCollectedFacts] = useState({ 
      symptoms: [], 
      farmerNotes: "" 
  });

  const handleNextStep = (newFacts) => {
    // Merge new symptoms and notes
    setCollectedFacts(prev => ({
        symptoms: [...new Set([...prev.symptoms, ...(newFacts.symptoms || [])])],
        farmerNotes: (prev.farmerNotes + "\n" + (newFacts.farmerNotes || '')).trim()
    }));
    
    if (step === STEPS.INITIAL_INPUT) {
        setStep(STEPS.CONVERSATION);
    } else if (step === STEPS.CONVERSATION) {
        setStep(STEPS.SYMPTOM_REVIEW);
    } 
  };
  
  const handleDiagnose = async (finalFacts) => {
    setLoading(true);
    setDiagnosis(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: finalFacts.symptoms, notes: finalFacts.farmerNotes }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDiagnosis({ ...data, farmerNotes: finalFacts.farmerNotes });
      setStep(STEPS.RESULTS);

    } catch (e) {
      console.error("Diagnosis error:", e);
      setError("Failed to connect to the AgriBot backend. Ensure the Flask server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const resetKBS = () => {
    setStep(STEPS.INITIAL_INPUT);
    setDiagnosis(null);
    setCollectedFacts({ symptoms: [], farmerNotes: "" });
    setError(null);
  };

  const renderCurrentStep = () => {
    switch (step) {
      case STEPS.INITIAL_INPUT:
        return (
          <ImageUpload 
            onProceed={handleNextStep} 
          />
        );
      case STEPS.CONVERSATION:
        return (
          <ChatPanel 
            onProceed={handleNextStep} 
            initialSymptoms={collectedFacts.symptoms}
            initialNotes={collectedFacts.farmerNotes}
          />
        );
      case STEPS.SYMPTOM_REVIEW:
        return (
          <SymptomForm 
            onDiagnose={handleDiagnose} 
            loading={loading}
            error={error}
            initialSelectedSymptoms={collectedFacts.symptoms}
            initialNotes={collectedFacts.farmerNotes}
          />
        );
      case STEPS.RESULTS:
        return (
          <ResultsDisplay 
            diagnosis={diagnosis} 
            onReset={resetKBS}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AgriBot: Knowledge-Based Decision System</h1>
        <p>Conversational & Image-Guided Expert System</p>
      </header>
      
      <div className="main-content-container">
        {renderCurrentStep()}
      </div>
    </div>
  );
}

export default App;