import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; // 스타일 적용

const FindAccountPage = () => {
    const navigate = useNavigate();
    
    // [상태] 현재 탭: 'id' (아이디 찾기) 또는 'pw' (비번 찾기)
    const [activeTab, setActiveTab] = useState('id');

    // [상태] 입력값들
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); // 비번 찾기용
    const [phone, setPhone] = useState('');       // 비번 찾기용

    // [상태] 결과 메시지
    const [resultMessage, setResultMessage] = useState('');

    // 1. 아이디 찾기 요청
    const handleFindId = async () => {
        if (!email) return alert("가입할 때 쓴 이메일을 입력해주세요!");
        try {
            // 백엔드 API 주소 (MemberController 확인 필요)
            // 예시: GET /api/members/find-id?email=...
            const response = await axios.get(`http://localhost:8090/api/members/find-id?email=${email}`);
            setResultMessage(`회원님의 아이디는 [ ${response.data} ] 입니다.`);
        } catch (error) {
            setResultMessage("일치하는 정보를 찾을 수 없습니다.");
        }
    };

    // 2. 비밀번호 찾기 요청 (임시 비번 발급 등)
    const handleFindPw = async () => {
        if (!username || !phone) return alert("아이디와 전화번호를 입력해주세요!");
        try {
            // 예시: POST /api/members/find-pw
            const response = await axios.post('http://localhost:8090/api/members/find-pw', {
                username: username,
                phone: phone
            });
            setResultMessage(`임시 비밀번호: [ ${response.data} ] (로그인 후 변경하세요)`);
        } catch (error) {
            setResultMessage("정보가 일치하지 않습니다.");
        }
    };

    return (
        <div className="login-card" style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2 style={{color: '#006064', textAlign: 'center'}}>계정 찾기</h2>

            {/* 탭 버튼 */}
            <div className="tab-buttons" style={{marginTop: '20px'}}>
                <button 
                    className={`tab-btn ${activeTab === 'id' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('id'); setResultMessage(''); }}
                >
                    아이디 찾기
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'pw' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('pw'); setResultMessage(''); }}
                >
                    비밀번호 찾기
                </button>
            </div>

            {/* 내용 영역 */}
            <div style={{marginTop: '20px'}}>
                {activeTab === 'id' ? (
                    // === 아이디 찾기 폼 ===
                    <div>
                        <p style={{marginBottom: '10px', fontSize: '0.9rem', color: '#666'}}>
                            가입 시 등록한 <strong>이메일</strong>을 입력하세요.
                        </p>
                        <input 
                            className="form-input" 
                            placeholder="이메일 (example@email.com)" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="btn-primary" onClick={handleFindId}>아이디 찾기</button>
                    </div>
                ) : (
                    // === 비밀번호 찾기 폼 ===
                    <div>
                        <p style={{marginBottom: '10px', fontSize: '0.9rem', color: '#666'}}>
                            가입한 <strong>아이디</strong>와 <strong>전화번호</strong>를 입력하세요.
                        </p>
                        <input 
                            className="form-input" 
                            placeholder="아이디" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input 
                            className="form-input" 
                            placeholder="전화번호 (010-0000-0000)" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <button className="btn-primary" onClick={handleFindPw}>비밀번호 찾기</button>
                    </div>
                )}
            </div>

            {/* 결과 메시지 표시 */}
            {resultMessage && (
                <div style={{
                    marginTop: '20px', 
                    padding: '15px', 
                    backgroundColor: '#e0f7fa', 
                    color: '#006064', 
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}>
                    {resultMessage}
                </div>
            )}

            <button 
                onClick={() => navigate('/login')} 
                className="btn-link" 
                style={{marginTop: '20px', width: '100%'}}
            >
                로그인 화면으로 돌아가기
            </button>
        </div>
    );
};

export default FindAccountPage;