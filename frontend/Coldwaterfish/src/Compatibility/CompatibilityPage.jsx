import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * [파일의 역할]: 정해진 어종 리스트 내에서만 선택하게 하여 오타로 인한 검색 오류를 방지합니다.
 */
const CompatibilityPage = () => {
  const navigate = useNavigate();
  
  // [데이터]: 제공해주신 20종의 이름을 배열로 만듭니다.
  const fishList = [
    '각시붕어', '갈겨니', '강도다리', '곤들매기', '금강모치', 
    '꺽지', '독중개', '돌고기', '무지개 송어', '묵납자루', 
    '미유기', '버들치', '브라운 송어', '빙어', '산천어', 
    '쉬리', '열목어', '은어', '큰가시고기', '황어'
  ];

  const [fishA, setFishA] = useState('');
  const [fishB, setFishB] = useState('');
  const [result, setResult] = useState(null);

  /**
   * [작동 순서]:
   * 1. 사용자가 드롭다운에서 물고기를 선택합니다. (이때 값은 DB와 100% 일치함)
   * 2. '궁합 확인' 버튼을 누르면 선택된 두 이름이 백엔드로 전달됩니다.
   * 3. DB에서 정확히 일치하는 행(Row)을 찾아 결과를 반환합니다.
   */
  const handleCheck = async () => {
    if (!fishA || !fishB) return alert("물고기를 선택해주세요.");
    
    try {
      const response = await axios.get('http://localhost:8090/api/compatibility', {
        params: { a: fishA, b: fishB }
      });
      setResult(response.data);
    } catch (error) {
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button onClick={() => navigate('/menu')}>← 나가기</button>
      <h2> 냉수어 합사 판단기</h2>
      
      <div style={{ margin: '20px 0' }}>
        {/* 직접 입력 대신 선택(Select) 박스 사용 */}
        <select value={fishA} onChange={(e) => setFishA(e.target.value)} style={styles.select}>
          <option value="">물고기 선택 1</option>
          {fishList.map(name => <option key={name} value={name}>{name}</option>)}
        </select>

        <span style={{ margin: '0 10px' }}>VS</span>

        <select value={fishB} onChange={(e) => setFishB(e.target.value)} style={styles.select}>
          <option value="">물고기 선택 2</option>
          {fishList.map(name => <option key={name} value={name}>{name}</option>)}
        </select>

        <button onClick={handleCheck} style={styles.btn}>결과 보기</button>
      </div>

      {result && (
        <div style={{ border: '2px solid #3498db', borderRadius: '10px', padding: '20px' }}>
          <h3>[{result.status}]</h3>
          <p>{result.reason}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  select: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginRight: '5px' },
  btn: { padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default CompatibilityPage;