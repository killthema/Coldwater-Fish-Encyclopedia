/**
 * [코드의 역할]
 * 이 페이지는 냉수어 도감과 AI 분석을 동시에 수행하는 '탐험 센터'입니다.
 * 특히 AI 탭은 사용자의 이미지를 Spring Boot를 거쳐 Python AI 서버로 전달하고 결과를 받아옵니다.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import "../MenuPage/MenuPage.css";


const SearchPage = () => {
    const [activeTab, setActiveTab] = useState('dictionary');
    const [fishList, setFishList] = useState([]);
    const [keyword, setKeyword] = useState('');

    // --- [AI 분석용 상태(State) 주머니] ---
    const [selectedFile, setSelectedFile] = useState(null); // 실제 이미지 파일
    const [previewUrl, setPreviewUrl] = useState(null);     // 화면에 보여줄 미리보기 주소
    const [aiResult, setAiResult] = useState(null);         // AI가 분석해서 보내준 결과 데이터
    const [loading, setLoading] = useState(false);           // 서버가 일하는 중인지 확인용

    // (도감 검색 함수 fetchFishList는 기존과 동일하므로 생략)

    /**
     * [작동 순서 1: 파일 선택 및 미리보기]
     * 사용자가 컴퓨터에서 사진을 고르면 실행됩니다.
     */
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // 선택한 첫 번째 파일
        if (file) {
            setSelectedFile(file); // 실제 파일 저장
            setPreviewUrl(URL.createObjectURL(file)); // 브라우저용 임시 이미지 주소 생성
            setAiResult(null); // 새로운 사진을 올렸으니 이전 결과는 지움
        }
    };

    /**
     * [작동 순서 2: AI 분석 요청 (Spring Boot 8090 포트 연동)]
     * '정체 확인하기' 버튼을 누르면 실행됩니다.
     */
    const handleAiAnalyze = async () => {
        if (!selectedFile) return alert("사진을 먼저 선택해주세요!");

        setLoading(true); // 분석 시작 (버튼 비활성화용)
        const formData = new FormData(); // 사진은 일반 텍스트가 아니므로 포장지가 필요함
        formData.append("file", selectedFile); // Spring Boot에서 받을 이름 'file'

        try {
            // Spring Boot의 AI 분석 엔드포인트로 전송
            const response = await axios.post('http://localhost:8090/api/fish-list/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' } // 파일 전송용 설정
            });
            setAiResult(response.data); // 성공하면 AI가 보내준 물고기 이름, 설명 등을 저장
        } catch (error) {
            console.error(error);
            alert("AI 분석 실패! (파이썬 서버와 스프링 부트 상태를 확인하세요)");
        } finally {
            setLoading(false); // 분석 끝
        }
    };

    return (
        <div className="search-page-container">
            <h1>냉수어 탐험 및 AI 분석</h1>

            <div className="tab-buttons">
                <button onClick={() => setActiveTab('dictionary')} className={activeTab === 'dictionary' ? 'active' : ''}>도감 검색</button>
                <button onClick={() => setActiveTab('ai')} className={activeTab === 'ai' ? 'active' : ''}>AI 사진 분석</button>
            </div>

            {/* === [탭 1] 도감 검색 영역 === */}
            {activeTab === 'dictionary' && (
                <div className="dictionary-view">
                    {/* (도감 검색 UI는 이전과 동일) */}
                </div>
            )}

            {/* === [탭 2] AI 사진 분석 영역 (여기가 비어있었습니다!) === */}
            {activeTab === 'ai' && (
                <div className="ai-view" style={{ textAlign: 'center', marginTop: '30px' }}>
                    <div className="upload-container" style={{ border: '2px dashed #3498db', padding: '40px', borderRadius: '15px', cursor: 'pointer' }}>
                        {/* 숨겨진 input 태그 */}
                        <input type="file" id="ai-upload" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                        <label htmlFor="ai-upload" style={{ cursor: 'pointer' }}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="미리보기" style={{ maxWidth: '100%', height: '300px', borderRadius: '10px' }} />
                            ) : (
                                <div className="placeholder">
                                    <p style={{ fontSize: '1.2rem', color: '#3498db' }}>📷 이 곳을 클릭하여 물고기 사진을 올려주세요.</p>
                                    <p style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>송어, 산천어 등 냉수성 어종 판별이 가능합니다.</p>
                                </div>
                            )}
                        </label>
                    </div>

                    <button 
                        onClick={handleAiAnalyze} 
                        disabled={loading || !selectedFile}
                        style={{ marginTop: '20px', padding: '15px 40px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '1.1rem' }}
                    >
                        {loading ? "AI가 열심히 분석 중..." : "이 물고기의 정체 확인하기"}
                    </button>

                    {/* [작동 순서 3: AI 분석 결과 출력] */}
                    {aiResult && (
                        <div className="ai-result-card" style={{ marginTop: '30px', padding: '20px', background: '#f8f9fa', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                            <h2 style={{ color: '#2980b9' }}>분석 결과: <span style={{ color: '#e67e22' }}>{aiResult.name}</span></h2>
                            <p style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>{aiResult.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px', color: '#7f8c8d' }}>
                                <span>적정 수온: {aiResult.tempMin}~{aiResult.tempMax}°C</span>
                                <span>서식지: {aiResult.habitat}</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchPage;