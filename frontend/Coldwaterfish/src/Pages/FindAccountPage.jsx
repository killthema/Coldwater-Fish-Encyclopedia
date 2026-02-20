import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 

const FindAccountPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('id');

    // [상태 관리]: 사용자가 입력하는 값을 실시간으로 저장합니다.
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); 
    const [resultMessage, setResultMessage] = useState('');

    /**
     * 1. [함수 역할]: 아이디 찾기 요청 처리
     * [작동 순서]:
     * 1) 이메일 입력 여부 확인
     * 2) axios.post를 통해 서버에 이메일 정보 전달
     * 3) 서버로부터 받은 아이디 찾기 결과를 화면에 표시
     */
    const handleFindId = async () => {
        if (!email) return alert("가입할 때 쓴 이메일을 입력해주세요!");
        try {
            // [수정]: GET -> POST로 변경하여 서버의 @PostMapping과 맞춤
            // [데이터]: { email: email } 객체 형태로 보냄 (Member 엔티티의 필드명과 일치)
            const response = await axios.post('http://localhost:8090/api/members/find-id', {
                email: email
            });
            setResultMessage(response.data); 
        } catch (error) {
            setResultMessage("일치하는 정보를 찾을 수 없습니다.");
        }
    };

    /**
     * 2. [함수 역할]: 비밀번호 찾기 요청 처리
     * [작동 순서]:
     * 1) 아이디와 이메일 입력 여부 확인
     * 2) 서버의 /api/members/find-pw 주소로 데이터 전송
     * 3) 성공 시 서버에서 보낸 "메일을 발송했습니다" 메시지 출력
     */
    const handleFindPw = async () => {
        if (!username || !email) return alert("아이디와 이메일을 모두 입력해주세요!");
        try {
            // [작동]: 백엔드 MemberController의 @PostMapping("/find-pw")를 호출합니다.
            // [중요]: 키값(username, email)은 자바 Member.java의 변수명과 대소문자까지 같아야 함!
            const response = await axios.post('http://localhost:8090/api/members/find-pw', {
                username: username, // DB의 login_id 컬럼과 매핑된 필드
                email: email
            });
            setResultMessage(response.data);
        } catch (error) {
            // [결과]: 서버에서 404나 500 에러를 던질 경우 실행
            setResultMessage("정보가 일치하지 않습니다. 아이디와 이메일을 확인해주세요.");
        }
    };

    return (
        <div className="login-card" style={{ maxWidth: '400px', margin: '50px auto' }}>
            <h2 style={{color: '#006064', textAlign: 'center'}}>계정 찾기</h2>

            <div className="tab-buttons" style={{marginTop: '20px'}}>
                <button 
                    className={`tab-btn ${activeTab === 'id' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('id'); setResultMessage(''); setEmail(''); setUsername(''); }}
                >
                    아이디 찾기
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'pw' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('pw'); setResultMessage(''); setEmail(''); setUsername(''); }}
                >
                    비밀번호 찾기
                </button>
            </div>

            <div style={{marginTop: '20px'}}>
                {activeTab === 'id' ? (
                    <div>
                        <p style={{marginBottom: '10px', fontSize: '0.9rem', color: '#666'}}>가입 시 등록한 이메일을 입력하세요.</p>
                        <input 
                            className="form-input" 
                            placeholder="이메일 (example@email.com)" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="btn-primary" onClick={handleFindId}>아이디 찾기 메일 발송</button>
                    </div>
                ) : (
                    <div>
                        <p style={{marginBottom: '10px', fontSize: '0.9rem', color: '#666'}}>가입한 아이디와 이메일을 입력하세요.</p>
                        <input 
                            className="form-input" 
                            placeholder="아이디" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input 
                            className="form-input" 
                            placeholder="가입 시 등록한 이메일" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="btn-primary" onClick={handleFindPw}>비밀번호 찾기 메일 발송</button>
                    </div>
                )}
            </div>

            {resultMessage && (
                <div style={{
                    marginTop: '20px', padding: '15px', 
                    backgroundColor: '#e0f7fa', color: '#006064', 
                    borderRadius: '8px', textAlign: 'center', fontWeight: 'bold'
                }}>
                    {resultMessage}
                </div>
            )}

            <button onClick={() => navigate('/login')} className="btn-link" style={{marginTop: '20px', width: '100%'}}>
                로그인 화면으로 돌아가기
            </button>
        </div>
    );
};

export default FindAccountPage;