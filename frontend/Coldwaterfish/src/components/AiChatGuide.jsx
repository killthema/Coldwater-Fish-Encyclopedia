import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { askToFishAi } from '../api/api';
import './AiChatGuide.css';

const AiChatGuide = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '반갑습니다! 냉수어 사육에 대해 무엇이든 물어보세요.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef();

  
 
  const handleExit = () => {
    if (window.confirm("상담을 종료하고 나가시겠습니까?")) {
      navigate('/menu'); 
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await askToFishAi(input);
      const aiMsg = { sender: 'ai', text: data.answer };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: '죄송합니다. 통신 중 오류가 발생했습니다.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      
      <div className="chat-header">
        <button className="exit-btn" onClick={handleExit}>←</button>
        <h3>냉수어종 상담</h3>
        <div style={{ width: '30px' }}></div> 
      </div>

      <div className="chat-messages" ref={scrollRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.sender}`}>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper ai">
            <div className="message-bubble loading">AI가 답변을 작성 중입니다...</div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="냉수어에 대해 궁금한 점을 물어보세요."
        />
        <button className="send-btn" onClick={handleSend} disabled={isLoading}>전송</button>
      </div>
    </div>
  );
};

export default AiChatGuide;