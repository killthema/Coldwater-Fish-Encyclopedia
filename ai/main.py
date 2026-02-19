# [파일의 역할]: 학습된 AI 모델(fish_model.h5)을 사용하여
# 리액트 앱으로부터 전송받은 물고기 사진을 실시간으로 판별하고 결과를 반환합니다.

import os
import io
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model

# [1] Flask 앱 초기화 및 CORS 설정
app = Flask(__name__)
# [역할]: 리액트(포트 5173 등)에서 오는 요청을 보안 차단 없이 허용합니다.
CORS(app)

# [2] 학습된 AI 모델 불러오기
# [역할]: train.py를 통해 생성된 'fish_model.h5' 파일을 메모리에 로드합니다.

MODEL_PATH = 'fish_model.h5'
model = load_model(MODEL_PATH)

# [3] 물고기 이름 리스트 (라벨링 순서)
# [역할]: AI가 예측한 숫자 인덱스를 실제 물고기 이름으로 변환합니다.

fish_names = [
    '각시붕어', '갈겨니', '강도다리', '곤들매기', '금강모치',
    '꺽지', '독중개', '돌고기', '무지개 송어', '묵납자루',
    '미유기', '버들치', '브라운 송어', '빙어', '산천어',
    '쉬리', '열목어', '은어', '큰가시고기', '황어'
]


# [4] 이미지 판독 API 경로 설정
@app.route('/predict', methods=['POST'])
def predict():


    # (1) 파일 수신 여부 확인
    if 'file' not in request.files:
        return jsonify({"name": "에러", "description": "전송된 파일이 없습니다."}), 400

    file = request.files['file']

    try:
        # (2) 이미지 전처리

        img = Image.open(io.BytesIO(file.read())).convert('RGB')
        img = img.resize((224, 224))

        # [역할]: 픽셀 데이터를 0~1 사이 값으로 압축하고 AI 입력을 위한 차원을 확장합니다.
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # (3) AI 판독 및 확신도 계산
        prediction = model.predict(img_array)
        confidence = np.max(prediction)  # 판독 결과 중 가장 높은 확률값
        result_index = np.argmax(prediction)

        # (4) 물고기 여부 필터링 (사용자님 요청 추가 로직)
        # [역할]: 확신도가 60% 미만일 경우 물고기가 아닌 것으로 판단합니다.
        if confidence < 0.6:
            return jsonify({
                "name": "인식 불가",
                "description": "물고기 사진이 아닌 것 같습니다. 정확한 물고기 사진을 다시 올려주세요!"
            })

        # (5) 최종 결과 반환
        fish_name = fish_names[result_index]
        return jsonify({
            "name": fish_name,
            "description": f"AI 분석 결과 이 물고기는 {fish_name}일 확률이 {confidence * 100:.1f}%입니다."
        })

    except Exception as e:
        return jsonify({"name": "에러", "description": f"분석 중 오류 발생: {str(e)}"}), 500


# [5] 서버 실행
if __name__ == '__main__':

    print("냉수어 AI 분석 서버 가동 중 (포트: 5000)...")
    app.run(host='0.0.0.0', port=5000)