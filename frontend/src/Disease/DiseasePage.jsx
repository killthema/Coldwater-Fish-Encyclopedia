import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const DiseasePage = () => {
    const navigate = useNavigate();
    const [allDiseases, setAllDiseases] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8090/api/diseases')
            .then(res => {
                
                setAllDiseases(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            })
            .catch(e => {
                console.error("로딩 실패:", e);
                setLoading(false);
            });
    }, []);

    
    
    const filteredDiseases = (allDiseases || []).filter(disease => {
        const nameMatch = disease.name?.includes(searchTerm);
        const symptomMatch = disease.symptoms?.includes(searchTerm);
        return nameMatch || symptomMatch;
    });

    return (
        <div className="disease-wrapper" style={{ paddingTop: '60px' }}>
            <div className="top-nav-bar">
                <span className="exit-btn" style={{cursor: 'pointer'}} onClick={() => navigate('/menu')}>나가기</span>
            </div>

            <div className="login-card" style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
                <div className="login-header">
                    <h2> 질병 진단 서비스</h2>
                    <input 
                        className="form-input" 
                        placeholder="증상을 입력하세요 (예: 하얀 점)" 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </div>

                <div className="disease-grid" style={{ marginTop: '20px' }}>
                    {loading ? (
                        <p>데이터를 불러오는 중입니다...</p>
                    ) : filteredDiseases.length > 0 ? (
                        filteredDiseases.map(disease => (
                            <div key={disease.id} className="mini-card" style={{ padding: '15px', marginBottom: '10px', background: '#fff', borderLeft: '5px solid red', textAlign: 'left' }}>
                                <h3 style={{color: 'red'}}>{disease.name}</h3>
                                <p><strong>증상:</strong> {disease.symptoms}</p>
                                <p><strong>치료:</strong> {disease.treatment}</p>
                            </div>
                        ))
                    ) : (
                        <p>검색 결과가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};


export default DiseasePage;