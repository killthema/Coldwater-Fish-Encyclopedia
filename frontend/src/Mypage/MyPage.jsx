
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const MyPage = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('user') || '사용자';
    const memberId = 1; // [참고]: 실제 운영 시에는 로그인한 유저의 ID가 들어갑니다.

    // === [상태 관리 변수] ===
    const [form, setForm] = useState({ name: '', w: '', d: '', h: '' }); // 입력 폼 데이터
    const [matchingFish, setMatchingFish] = useState([]);               // 서버에서 받아온 추천 어종 리스트 
    const [myTanks, setMyTanks] = useState([]);                         // 내가 저장한 전체 수조 목록 
    const [liter, setLiter] = useState(0);                              // 실시간으로 계산된 수조 용량(L) 

    // === [작동 순서 1: 기존 목록 불러오기] ===
    // 페이지가 처음 열릴 때 서버에서 사용자의 수조 데이터를 가져옵니다. 
    const loadMyTanks = () => {
        axios.get(`http://localhost:8090/api/tanks/user/${memberId}`)
            .then(res => setMyTanks(res.data))
            .catch(e => console.error("로딩 실패", e));
    };

    useEffect(loadMyTanks, []);

    // === [작동 순서 2: 저장 및 매칭 실행] ===
    const handleSaveAndMatch = async () => {
        const { name, w, d, h } = form;
        if (!name || !w || !d || !h) return alert("빈칸을 채워주세요!");

        // [역할]: 수조 용량 계산 공식 적용 
        // $$Volume(L) = (Width \times Depth \times Height) / 1000$$
        const calcL = Math.floor((w * d * h) / 1000); 
        setLiter(calcL);

        try {
            // [작동]: 자바 서버의 /save-and-match 엔드포인트로 데이터 전송
            const res = await axios.post('http://localhost:8090/api/tanks/save-and-match', {
                memberId, 
                tankName: name, 
                tankSize: `${w}x${d}x${h}`, 
                volumeLiter: calcL
            }); 
            
            setMatchingFish(res.data); // 결과로 받은 물고기 리스트 저장 
            loadMyTanks();             // 하단 히스토리 목록 새로고침
        } catch (e) { 
            alert("서버와 통신할 수 없습니다. 서버 상태를 확인하세요!"); 
        }
    };

    return (
        <div className="mypage-wrapper" style={{ paddingTop: '60px' }}>
            {/* 상단바 */}
            <div className="top-nav-bar">
                <span className="exit-btn" onClick={() => navigate('/menu')}>나가기</span>
            </div>

            <div className="login-card" style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
                <div className="login-header"><h2> {username}님의 연구소</h2></div>

                {/* [역할]: 수조 치수 입력 폼 */}
                <div className="tank-form">
                    <input className="form-input" placeholder="수조 별명 (예: 거실 메인)" 
                           onChange={e => setForm({...form, name: e.target.value})} />
                    <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
                        {['w', 'd', 'h'].map(k => (
                            <input key={k} className="form-input" type="number" 
                                   placeholder={k==='w'?'가로':k==='d'?'세로':'높이'} 
                                   onChange={e => setForm({...form, [k]: e.target.value})} />
                        ))}
                    </div>
                </div>
                
                <button className="btn-primary" onClick={handleSaveAndMatch}> 저장 및 매칭</button>

                {/* === [결과 영역: 추천 어종 리스트] === */}
                {liter > 0 && (
                    <div className="result-section" style={{ marginTop: '30px' }}>
                        <h3 style={{ borderBottom: '2px solid #006064' }}> {liter}L 추천 어종</h3>
                        <div className="fish-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                            {matchingFish.map(fish => (
                                <div key={fish.id} className="mini-card" style={{ padding: '15px', background: '#f8f9fa', borderRadius: '10px', borderLeft: '5px solid #006064' }}>
                                    <div>
                                        <b style={{ fontSize: '1.1rem' }}>{fish.name}</b><br/>
                                        <small style={{ color: '#666' }}>최소 {fish.minTankSize}L 필요</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* === [히스토리 영역: 나의 수조 목록] === */}
                <div className="history-section" style={{ marginTop: '50px', textAlign: 'left' }}>
                    <h3 style={{ borderBottom: '2px solid #ccc' }}> 나의 수조 히스토리</h3>
                    {myTanks.map(tank => (
                        <div key={tank.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #eee' }}>
                            <span><strong>{tank.tankName}</strong> ({tank.tankSize})</span>
                            <span style={{ color: '#006064', fontWeight: 'bold' }}>{tank.volumeLiter}L</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyPage;