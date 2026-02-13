/**
 * [파일의 역할]
 * 도감 검색(MariaDB)과 AI 분석(Python)을 한 페이지에서 탭으로 나누어 제공합니다. [cite: 2026-01-06]
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchPage.css';

const SearchPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dictionary'); // [역할]: 현재 도감인지 AI인지 구분
    const [keyword, setKeyword] = useState(''); 
    const [searchResult, setSearchResult] = useState(null); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // [작동 순서 1]: 도감 검색 핸들러
    const handleSearch = async () => {
        if (!keyword) return alert("물고기 이름을 입력해주세요!");
        try {
            const response = await axios.get(`http://localhost:8090/api/fish-list/search?keyword=${keyword}`);
            if (response.data && response.data.length > 0) {
                setSearchResult(response.data[0]); // [역할]: 첫 번째 검색 결과를 상태에 저장
            } else {
                alert("검색 결과가 없습니다.");
                setSearchResult(null);
            }
        } catch (error) {
            alert("서버 연결 실패!");
        }
    };

    // [작동 순서 2]: AI 사진 선택 핸들러 [cite: 2026-02-13]
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        }
    };

    return (
        <div className="search-page-wrapper">
            <div className="top-nav-bar">
                <span className="exit-btn" onClick={() => navigate('/menu')}>나가기</span>
            </div>

            <div className="search-container-styled">
                <h2 className="page-headline">냉수어 도감 검색</h2>

                {/* [수정]: 사라졌던 탭 메뉴를 다시 추가했습니다. [cite: 2026-02-13] */}
                <div className="tab-menu-styled">
                    <button 
                        onClick={() => setActiveTab('dictionary')} 
                        className={activeTab === 'dictionary' ? 'active' : ''}
                    > 도감 검색</button>
                    <button 
                        onClick={() => setActiveTab('ai')} 
                        className={activeTab === 'ai' ? 'active' : ''}
                    > AI 사진 분석</button>
                </div>

                {/* === [탭 1] 도감 검색 영역 === */}
                {activeTab === 'dictionary' && (
                    <div className="dictionary-section-styled">
                        <div className="search-bar-styled">
                            <input 
                                type="text" 
                                placeholder="물고기 이름 입력 (예: 산천어)" 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button onClick={handleSearch}>검색하기</button>
                        </div>

                        {/* [작동 순서 3]: 1241.jpg처럼 상세 정보를 모두 출력합니다. */}
                        {searchResult && (
                            <div className="result-card-clean slide-up">
                                <h3 className="clean-title">
                                    {searchResult.name} <span className="group-tag">({searchResult.groupType})</span>
                                </h3>
                                <div className="clean-content">
                                    <p><strong>특징:</strong> {searchResult.description}</p>
                                    <div className="info-grid">
                                        <p><strong> 서식지:</strong> {searchResult.habitat}</p>
                                        <p><strong>적정수온:</strong> {searchResult.tempMin}~{searchResult.tempMax}°C</p>
                                        <p><strong> 권장수조:</strong> {searchResult.minTankSize}L 이상</p>
                                        <p><strong> 사육수:</strong> {searchResult.minCount}마리 이상</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* === [탭 2] AI 사진 분석 영역 (복구 완료) === [cite: 2026-02-13] */}
                {activeTab === 'ai' && (
                    <div className="ai-section-styled">
                        <div className="upload-box-styled">
                            <input type="file" id="ai-upload" accept="image/*" onChange={handleFileChange} hidden />
                            <label htmlFor="ai-upload" className="upload-label">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="미리보기" className="preview-img-styled" />
                                ) : (
                                    <div className="placeholder"> 클릭하여 사진 업로드</div>
                                )}
                            </label>
                        </div>
                        <button className="analyze-btn-styled" disabled={!selectedFile}>
                            분석 시작하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;