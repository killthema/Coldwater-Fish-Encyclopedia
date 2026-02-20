import os
import io
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model

# ==========================================
# [무료 RAG 무기들] 오픈소스 로컬 라이브러리
# ==========================================
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.chat_models import ChatOllama


from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

app = Flask(__name__)
CORS(app)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ==========================================
# [1] 도감 모델 로드 (과금 없음)
# ==========================================
MODEL_PATH = os.path.join(BASE_DIR, 'fish_model.h5')
vision_model = None
try:
    vision_model = load_model(MODEL_PATH)
    print("[1/2] 비전 모델(도감) 로드 성공!")
except Exception as e:
    print(f" 도감 모델 로드 실패: {e}")

fish_names = [
    '각시붕어', '갈겨니', '강도다리', '곤들매기', '금강모치',
    '꺽지', '독중개', '돌고기', '무지개 송어', '묵납자루',
    '미유기', '버들치', '브라운 송어', '빙어', '산천어',
    '쉬리', '열목어', '은어', '큰가시고기', '황어'
]

# ==========================================
# [2] 무료 RAG 지식베이스 로드 (LCEL 최신 기술 적용)
# ==========================================
rag_chain = None
try:
    txt_path = os.path.join(BASE_DIR, 'fish_data.txt')
    loader = TextLoader(txt_path, encoding='utf-8')
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    splits = text_splitter.split_documents(docs)

    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectorstore = Chroma.from_documents(documents=splits, embedding=embeddings)
    retriever = vectorstore.as_retriever()

    llm = ChatOllama(model="qwen2:0.5b")

    system_prompt = (
        "너는 냉수어 사육 전문가야. "
        "반드시 아래에 제공된 문서(Context)의 내용만을 사용해서 한국어로 답변해줘. "
        "문서에 없는 내용이면 '제공된 도감 정보에는 없습니다'라고 말해.\n\n"
        "{context}"
    )
    prompt = ChatPromptTemplate.from_messages([("system", system_prompt), ("human", "{input}")])

    # 🛠️ [작동 순서]: 검색된 문서들을 하나의 긴 글로 예쁘게 합쳐주는 역할입니다.
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    # 🚀 [핵심]: 에러 나던 chains 대신 사용하는 직결 파이프라인(LCEL)입니다.
    # [작동 순서]: 질문 입력 -> DB 검색 -> 프롬프트 조립 -> AI 답변 -> 텍스트로 깔끔하게 출력
    rag_chain = (
        {"context": retriever | format_docs, "input": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    print("✅ [2/2] 100% 무료 로컬 RAG 지식베이스 세팅 성공! (LCEL 모드)")

except Exception as e:
    print(f"❌ RAG 데이터 로드 실패: {e}")


# ==========================================
# [3] 라우터 구역
# ==========================================
@app.route('/api/ai/advice', methods=['POST'])
def get_fish_advice():
    data = request.json
    user_question = data.get('question')

    if not rag_chain:
        return jsonify({'status': 'fail', 'message': "AI 지식베이스 에러"}), 500

    try:
        # LCEL 기술을 쓰면 복잡하게 딕셔너리에서 뽑아낼 필요 없이 곧바로 순수 텍스트 답변이 나옵니다.
        answer = rag_chain.invoke(user_question)
        return jsonify({'status': 'success', 'answer': answer})
    except Exception as e:
        return jsonify({'status': 'fail', 'message': f"무료 AI 통신 에러: {str(e)}"}), 500


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"name": "에러", "description": "전송된 파일이 없습니다."}), 400

    file = request.files['file']
    try:
        img = Image.open(io.BytesIO(file.read())).convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        prediction = vision_model.predict(img_array)
        confidence = np.max(prediction)
        result_index = np.argmax(prediction)

        if confidence < 0.6:
            return jsonify({"name": "인식 불가", "description": "물고기 사진이 아닌 것 같습니다."})

        return jsonify({"name": fish_names[result_index], "description": f"확률: {confidence * 100:.1f}%"})
    except Exception as e:
        return jsonify({"name": "에러", "description": "분석 중 오류 발생"}), 500


@app.route('/api/custom_feature', methods=['POST', 'GET'])
def custom_feature():
    return jsonify({'status': 'success', 'message': '여백 공간'})


if __name__ == '__main__':
    print(" 과금 없는 100% 로컬 AI 서버 가동 준비 완료 (포트: 5000)...")
    app.run(host='0.0.0.0', port=5000)