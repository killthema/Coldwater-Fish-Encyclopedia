import axios from 'axios';

// [기본 설정]
// 매번 'http://localhost:8090/api'를 치기 귀찮으니까 기본값으로 잡아둡니다.
// 백엔드(스프링부트) 주소가 8090번 포트라는 것을 기억하세요!
const api = axios.create({
  baseURL: 'http://localhost:8090/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// =================================================================
// 1. 물고기 도감 & AI 분석 (FishController + ColdWaterController)
// =================================================================
export const fishApi = {
  // [역할]: 전체 물고기 목록 가져오기 (도감 메인 화면용)
  // [Spring]: @GetMapping("/api/fish-list")
  getAllFish: async () => {
    const response = await api.get('/fish-list');
    return response.data; // 물고기 리스트 반환
  },

  // [역할]: 이름으로 검색하기
  // [Spring]: @GetMapping("/api/fish-list/search?keyword=...")
  searchFish: async (keyword) => {
    const response = await api.get(`/fish-list/search?keyword=${keyword}`);
    return response.data;
  },

  // [역할]: 수조 크기로 물고기 추천받기 (ColdWaterController)
  // [Spring]: @GetMapping("/api/fish/recommend")
  getRecommendation: async (width, depth, height) => {
    // 쿼리 스트링(?width=30&depth=30...) 형태로 보냄
    const response = await api.get(`/fish/recommend`, {
      params: { width, depth, height }
    });
    return response.data;
  },

  // [역할]: ⭐ AI 사진 판독 요청 (가장 중요!)
  // [Spring]: @PostMapping("/api/fish-list/predict")
  predictFish: async (file) => {
    // 사진은 JSON이 아니라 'FormData'라는 특수 박스에 담아야 함
    const formData = new FormData();
    formData.append('file', file); // Spring의 @RequestParam("file")과 이름 일치 필수!

    const response = await api.post('/fish-list/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // "나 지금 사진 보낸다"라고 알림
      },
    });
    return response.data; // AI 분석 결과(이름, 설명 등) 반환
  }
};

// =================================================================
// 2. 회원 관리 (MemberController)
// =================================================================
export const memberApi = {
  // [역할]: 회원가입
  // [Spring]: @PostMapping("/api/members/signup")
  signup: async (memberData) => {
    // memberData 예시: { username: "user1", password: "123", email: "a@a.com" }
    const response = await api.post('/members/signup', memberData);
    return response.data; // "회원가입 성공!" 메시지
  },

  // [역할]: 로그인
  // [Spring]: @PostMapping("/api/members/login")
  login: async (username, password) => {
    const response = await api.post('/members/login', { username, password });
    return response.data;
  },

  // [역할]: 아이디/비번 찾기
  findId: async (email) => {
      const response = await api.post('/members/find-id', { email });
      return response.data;
  },
  findPw: async (username, email) => {
      const response = await api.post('/members/find-pw', { username, email });
      return response.data;
  }
};

// =================================================================
// 3. 내 수조 관리 (MyTankController)
// =================================================================
export const tankApi = {
  // [역할]: 내 수조 정보 저장
  // [Spring]: @PostMapping("/api/tanks")
  saveTank: async (memberId, tankName, tankSize, volumeLiter) => {
    const data = { memberId, tankName, tankSize, volumeLiter };
    const response = await api.post('/tanks', data);
    return response.data;
  },

  // [역할]: 내 수조 목록 불러오기
  // [Spring]: @GetMapping("/api/tanks/user/{memberId}")
  getMyTanks: async (memberId) => {
    const response = await api.get(`/tanks/user/${memberId}`);
    return response.data;
  }
};

// =================================================================
// 4. 궁합 & 질병 (CompatibilityController, DiseaseController)
// =================================================================
export const utilApi = {
  // [역할]: 두 물고기 궁합 보기
  // [Spring]: @GetMapping("/api/compatibility?a=...&b=...")
  checkCompatibility: async (fishA, fishB) => {
    const response = await api.get(`/compatibility?a=${fishA}&b=${fishB}`);
    return response.data;
  },

  // [역할]: 질병 목록 가져오기
  // [Spring]: @GetMapping("/api/dieases") (오타 주의: dieases로 되어 있음)
  getDiseases: async () => {
    const response = await api.get('/dieases'); // 백엔드 오타에 맞춰서 요청
    return response.data;
  }
};

export const askToFishAi = async (question) => {
  try {
    const response = await api.post('/fish-ai/ask', { question: question });
    return response.data;
  } catch (error) {
    console.error("AI 상담 통신 중 오류 발생:", error);
    throw error;
  }
};

export default api;