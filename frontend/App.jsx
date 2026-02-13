/**
 * [파일의 역할]
 * 앱의 모든 페이지를 연결하는 내비게이션 센터입니다.
 * 주소창의 경로에 따라 어떤 화면을 보여줄지 결정합니다. [cite: 2026-01-06]
 */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/**
 * [작동 순서 1] 실제 폴더 구조(구조라.png)에 맞춰 컴포넌트를 불러옵니다.
 * 폴더명(Pages, MenuPage 등)의 대소문자를 칼같이 맞췄습니다.
 */
import LoginGateWay from './Pages/LoginGateWay';
import SignupPage from './Pages/SignupPage';
import FindAccountPage from './Pages/FindAccountPage';
import Menu from './MenuPage/Menu';
import SearchPage from './SearchPage/SearchPage';
import MyPage from './Mypage/MyPage'; // [수정] MyPage.jsx 파일 불러오기

function App() {
  /**
   * [작동 순서 2] 브라우저 저장소에서 로그인 증명서('user')를 확인합니다. [cite: 2026-01-06]
   */
  const isAuthenticated = localStorage.getItem('user');

  return (
    <Router>
      <Routes>
        {/* [순서 3] 첫 화면 설정: 무조건 로그인 화면을 띄웁니다. */}
        <Route path="/" element={<LoginGateWay />} />
        <Route path="/login" element={<LoginGateWay />} />
        
        {/* [순서 4] 보호 구역 설정: 로그인된 사람만 들어갈 수 있게 막습니다. [cite: 2026-01-06] */}
        <Route path="/menu" element={isAuthenticated ? <Menu /> : <Navigate to="/login" replace />} />
        <Route path="/search" element={isAuthenticated ? <SearchPage /> : <Navigate to="/login" replace />} />
        <Route path="/mypage" element={isAuthenticated ? <MyPage /> : <Navigate to="/login" replace />} />
        
        {/* [순서 5] 기타 회원 관리 페이지들 */}
        <Route path="/SignupPage" element={<SignupPage />} />
        <Route path="/find" element={<FindAccountPage />} />

        {/* 잘못된 주소로 접속하면 로그인 화면으로 튕겨냅니다. [cite: 2026-01-06] */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;