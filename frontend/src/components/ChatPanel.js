// D:\KBS_Agriculture\frontend\src\components\ChatPanel.js
import React, { useState } from 'react';

const CHAT_QUESTIONS = [
    // This fact helps trigger R1 (Nutrient)
    { key: 'new_growth_stunted', prompt: "KBS Query 1: Is the new growth at the top of the plant noticeably small or stunted?", rule: "new_growth_stunted" },
    
    // This fact helps trigger R4 (Wilt)
    { key: 'stems_cracked', prompt: "KBS Query 2: Are there deep cracks or lesions visible near the base of the stem?", rule: "stems_cracked" },
    
    // This is the critical fact for R5/R10 (Fusarium Wilt)
    { key: 'vascular_discoloration', prompt: "KBS Query 3: If you cut the main stem, is the inner vascular tissue brown or discolored? (Critical Fact)", rule: "vascular_discoloration" },
];

const ChatPanel = ({ onProceed, initialSymptoms, initialNotes }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userResponse, setUserResponse] = useState('');
    const [newSymptoms, setNewSymptoms] = useState(initialSymptoms);
    const [finalNotes, setFinalNotes] = useState(initialNotes);
    const [chatLog, setChatLog] = useState([
        { sender: 'system', message: `AgriBot is initiating targeted fact acquisition. We have **${initialSymptoms.length} fact(s)**. Please answer Yes/No/provide context.` },
    ]);

    const currentQuestion = CHAT_QUESTIONS[currentQuestionIndex];
    const isChatComplete = currentQuestionIndex >= CHAT_QUESTIONS.length;

    const handleSend = () => {
        if (!userResponse.trim() || isChatComplete) return;

        const factKey = currentQuestion.rule;
        const farmerText = userResponse.trim();
        
        setChatLog(prev => [...prev, { sender: 'user', message: farmerText }]);
        
        const lowerResponse = farmerText.toLowerCase();
        let systemMessage;
        
        if (lowerResponse.includes('yes') || lowerResponse.includes('true')) {
            if (!newSymptoms.includes(factKey)) {
                setNewSymptoms(prev => [...prev, factKey]);
                systemMessage = `Fact **${factKey}** confirmed. Moving on.`;
            } else {
                systemMessage = `Fact was already known. Moving on.`;
            }
        } else if (lowerResponse.includes('no') || lowerResponse.includes('not')) {
            systemMessage = `Fact **${factKey}** denied. Moving on.`;
        } else {
            setFinalNotes(prev => prev + "\n[Chat Response]: " + farmerText);
            systemMessage = "Thank you for the note. Appended to context. Next query.";
        }

        setChatLog(prev => [...prev, { sender: 'system', message: systemMessage }]);
        
        setUserResponse('');
        setCurrentQuestionIndex(prev => prev + 1);
    };
    
    const handleCompleteChat = () => {
        onProceed({ symptoms: newSymptoms, farmerNotes: finalNotes });
    }

    return (
        <div className="symptom-form-container">
            <div className="step-indicator">STEP 2 / 3: Conversational Fact Acquisition</div>
            <h2>AgriBot Chat Interface</h2>
            
            <div className="chat-window">
                {chatLog.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        <span style={{ fontWeight: 'bold' }}>
                            {msg.sender === 'system' ? 'AgriBot:' : 'Farmer:'}
                        </span> 
                        <span dangerouslySetInnerHTML={{ __html: ' ' + msg.message.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }} />
                    </div>
                ))}
            </div>

            {isChatComplete ? (
                <div style={{padding: '10px', border: '1px solid #ff8c00', borderRadius: '5px', backgroundColor: '#fff7e6'}}>
                    <p style={{ fontWeight: 'bold', color: '#ff8c00' }}>Chat complete. All facts gathered. Proceed to final review.</p>
                    <button 
                        onClick={handleCompleteChat}
                        style={{ padding: '12px 25px', backgroundColor: '#ff8c00', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1em' }}
                    >
                        Review Symptoms (Final Step)
                    </button>
                </div>
            ) : (
                <div>
                    <p style={{ fontWeight: 'bold' }}>{currentQuestion.prompt}</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <textarea 
                            value={userResponse} 
                            onChange={(e) => setUserResponse(e.target.value)} 
                            placeholder="Type 'Yes', 'No', or any additional context..."
                            className="farmer-notes-box"
                            style={{ minHeight: '50px', flexGrow: 1 }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <button 
                            onClick={handleSend}
                            style={{ padding: '10px 20px', backgroundColor: '#006400', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', alignSelf: 'flex-start' }}
                            disabled={!userResponse.trim()}
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPanel;