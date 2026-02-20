
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css'; //

const Menu = () => {
  const navigate = useNavigate();

  // [작동 순서 1] 로그아웃 버튼 클릭 시 로컬 저장소의 신분증('user')을 삭제합니다. 
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="menu-page">
      {/* [작동 순서 2] 상단 고정 검은색 네비게이션 바를 렌더링합니다. */}
      <nav className="black-header">
        <div className="nav-inner">
          <div className="nav-item" onClick={() => navigate('/search')}>물고기 도감</div>
          <span className="nav-item" onClick={() => navigate('/mypage')}>
                    나의 수조 체크하기
                </span>
          
          <span className="nav-item" onClick={() => navigate('/disease')}>물고기 질병 치료법</span>
          <div className="nav-item" onClick={() => navigate('/compatibilitypage')}>물고기 합사 가능 여부 판단 페이지</div>
          
         <div className="nav-item ai-link" onClick={() => navigate('/ai-guide')}>뭐든지 물어봐! 물고기에 관한 모든걸 알려주는 챗봇 </div>

          <div className="nav-item logout" onClick={handleLogout}>로그아웃</div>
        </div>
      </nav>

      {/* [작동 순서 3] 중앙 메인 콘텐츠 영역입니다. */}
      <main className="main-content">
        <h2 className="main-title">곧 챗봇 들어올 예정</h2>
      </main>
    </div>
  );
};

export default Menu;