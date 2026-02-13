/**
 * [파일의 역할]
 * 로그인 성공 후 만나는 메인 로비(Menu) 페이지입니다.
 * 상단에는 서비스 메뉴가 있고, 중앙에는 메인 메시지가 배치됩니다. [cite: 2026-01-06]
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MenuPage.css'; //

const Menu = () => {
  const navigate = useNavigate();

  // [작동 순서 1] 로그아웃 버튼 클릭 시 로컬 저장소의 신분증('user')을 삭제합니다. [cite: 2026-01-06]
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
          <div className="nav-item">나의 수조 상태</div>
          <div className="nav-item">질병 및 치료법</div>
          <div className="nav-item">합사 판별 가이드</div>
          <div className="nav-item">AI 수온 예측</div>
          <div className="nav-item logout" onClick={handleLogout}>로그아웃</div>
        </div>
      </nav>

      {/* [작동 순서 3] 중앙 메인 콘텐츠 영역입니다. */}
      <main className="main-content">
        <h2 className="main-title">냉수어종의 생존을 위한 기록</h2>
      </main>
    </div>
  );
};

export default Menu;