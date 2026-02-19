
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SearchPage.css';

const SearchPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dictionary'); // 탭 상태 ('dictionary' 또는 'ai')

    const [keyword, setKeyword] = useState('');               // 검색어 저장

    const [result, setResult] = useState(null);               // 자바 서버에서 받은 최종 결과 객체 

    const [preview, setPreview] = useState(null);             // 사진 미리보기 경로 (Blob 또는 public 경로) 

    const [loading, setLoading] = useState(false);            // 로딩 상태 표시

    // [설정]: public/images/fish/ 폴더 내에서 찾을 수 있는 확장자 목록 
    const extensions = ['jpg', 'png', 'jpeg', 'webp', 'JPG', 'PNG'];

    // === [작동 순서 1]: 도감 검색 핸들러 (Java @GetMapping("/search")) === 
    const onSearch = async () => {
        if (!keyword) return alert("물고기 이름을 입력하세요!");
        setLoading(true);
        setResult(null);
        try {
            // [역할]: 사용자가 입력한 키워드를 자바 서버(8090)로 전송하여 DB 정보를 가져옵니다. 
            const res = await axios.get(`http://localhost:8090/api/fish-list/search?keyword=${keyword}`);
            if (res.data.length > 0) {
                const fish = res.data[0];
                setResult(fish);
                // [작동]: 검색 성공 시 public 폴더 내 해당 이름의 사진 주소를 미리보기에 설정합니다. 
                setPreview(`/images/fish/${fish.name}.jpg`); 
            } else {
                alert("검색 결과가 없습니다.");
            }
        } catch (e) {
            alert("자바 서버와 연결할 수 없습니다.");
        } finally {
            setLoading(false);
        }
    };

    // === [작동 순서 2]: AI 분석 핸들러 
    const onAiAnalyze = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file)); // 사용자가 선택한 사진을 즉시 화면에 띄움 
        setLoading(true);
        setResult(null);

        const form = new FormData();
        form.append('file', file);
        try {
            
            const res = await axios.post('http://localhost:8090/api/fish-list/predict', form);
            setResult(res.data); 

        } catch (e) {
            // 자바 서버가 500 에러 등을 보냈을 때 메시지 출력 
            alert(e.response?.data || "분석 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // === [작동 순서 3]: 이미지 로드 에러 핸들러 (확장자 자동 탐색) === 
    const handleImageError = (e) => {
        // [역할]: 자바가 "판독 불가"라고 보내면 이미지를 더 찾지 않고 즉시 기본 이미지로 바꿉니다. 
        if (result?.name === "판독 불가") {
            e.target.onerror = null;
            e.target.src = '/images/fish/default_fish.jpg'; 
            return;
        }

        const attempt = parseInt(e.target.dataset.attempt || '0');
        if (attempt < extensions.length) {
            // [작동]: 다른 확장자(.png, .jpeg 등)로 파일이 있는지 순차적으로 확인합니다. 
            const nextExt = extensions[attempt];
            e.target.src = `/images/fish/${result.name}.${nextExt}`;
            e.target.dataset.attempt = attempt + 1;
        } else {
            // [작동]: 모든 시도가 실패하면 엑박 방지를 위해 기본 이미지를 출력합니다. 
            e.target.onerror = null;
            e.target.src = '/images/fish/default_fish.jpg';
        }
    };

    // === [역할]: 결과 정보를 담은 카드 컴포넌트 
    const ResultCard = ({ data }) => {
        // 판독 실패 시에는 내가 올린 사진을, 성공 시에는 public 폴더의 정식 사진을 우선적으로 보여줍니다. 
        const imgSrc = (data.name === "판독 불가" || (activeTab === 'ai' && preview && !preview.startsWith('/images'))) 
            ? preview 
            : `/images/fish/${data.name}.jpg`;

        return (
            <div className={`result-card-clean slide-up ${data.name === "판독 불가" ? 'warning-mode' : ''}`}>
                <div className="fish-image-frame">
                    <img 
                        src={imgSrc} 
                        alt={data.name} 
                        className="fish-result-img"
                        data-attempt="0"
                        onError={handleImageError} 
                    />
                </div>
                <div className="clean-content">
                    {/* [역할]: 자바에서 보낸 이름을 제목으로 출력 (판독 불가 시 붉은색 강조 가능)  */}
                    <h3 className="clean-title" style={{ color: data.name === "판독 불가" ? "#e74c3c" : "#2c3e50" }}>
                        {data.name}
                    </h3>
                    
                    {/* [작동]: 자바 컨트롤러에 작성된 상세 설명(\n 포함)을 줄바꿈을 유지하며 출력합니다. */}
                    <p className="main-desc" style={{ whiteSpace: 'pre-wrap' }}>
                        {data.description}
                    </p>
                    
                    {/* [역할]: DB 정보가 있는 경우에만 서식지와 수온을 표시합니다. */}
                    {data.habitat && data.habitat !== "-" && data.habitat !== "데이터 없음" && (
                        <div className="info-grid">
                            <p><strong> 서식지:</strong> {data.habitat}</p>
                            <p><strong> 수온:</strong> {data.tempMin}~{data.tempMax}°C</p>
                            {/* 해당 물고기에 맞는 수조를 찾아주는 기능은 다음 페이지에 있음 */}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="search-page-wrapper">
            <div className="top-nav-bar">
                <span className="exit-btn" onClick={() => navigate('/menu')}>나가기</span>
            </div>
            
            <div className="search-container-styled">
                <h2 className="page-headline">냉수어 AI 탐험 센터</h2>
                
                {/* 탭 메뉴 섹션 */}
                <div className="tab-menu-styled">
                    <button className={activeTab === 'dictionary' ? 'active' : ''} 
                            onClick={() => { setActiveTab('dictionary'); setResult(null); setPreview(null); }}>
                         물고기 이름 검색
                    </button>
                    <button className={activeTab === 'ai' ? 'active' : ''} 
                            onClick={() => { setActiveTab('ai'); setResult(null); setPreview(null); }}>
                         아래에  포획한 물고기 종류 알아내기를 클릭하면 지금 포획하시거나 키우시는 물고기 종류가 뭔지 알수있어요 
                    </button>
                </div>

                {/* 입력 및 업로드 섹션 */}
                {activeTab === 'dictionary' ? (
                    <div className="search-bar-styled">
                        <input 
                            value={keyword} 
                            onChange={e => setKeyword(e.target.value)} 
                            onKeyPress={e => e.key === 'Enter' && onSearch()} 
                            placeholder="물고기 이름 입력" 
                        />
                        <button onClick={onSearch}>검색</button>
                    </div>
                ) : (
                    <div className="upload-box-styled">
                        <input type="file" id="ai-upload" onChange={onAiAnalyze} hidden />
                        <label htmlFor="ai-upload" className="upload-label">
                            {loading ? "자바가 분석 중..." : preview ? <img src={preview} className="preview-img-styled" alt="p" /> : " 포획한 물고기 종류 알아내기"}
                        </label>
                    </div>
                )}
                
                {/* 결과 카드 출력 섹션 */}
                {result && !loading && <ResultCard data={result} />}
            </div>
        </div>
    );
};

export default SearchPage;