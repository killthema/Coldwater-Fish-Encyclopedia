import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# [1] 설정: 데이터가 있는 폴더 위치
# 주의: 이 폴더 안에 '무지개송어', '산천어' 같은 하위 폴더가 있어야 합니다.
DATA_DIR = './dataset'
IMG_SIZE = (224, 224)   # AI가 볼 사진 크기 (224x224)
BATCH_SIZE = 32         # 한 번에 공부할 사진 개수

# [2] 이미지 불러오기 (자동으로 크기 조절 및 라벨링)
print("이미지를 불러오는 중입니다...")

# 이미지 증강 (데이터가 적을 때 비틀거나 뒤집어서 학습량 늘리기)
train_datagen = ImageDataGenerator(
    rescale=1./255,       # 이미지 픽셀 값을 0~1로 압축 (필수)
    validation_split=0.2  # 전체 사진 중 20%는 시험(채점)용으로 씀
)

try:
    # 학습용 데이터 (80%)
    train_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )

    # 확인용 데이터 (20%)
    validation_generator = train_datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )
except FileNotFoundError:
    print(" 오류: 'dataset' 폴더를 찾을 수 없습니다!")
    print("현재 위치에 dataset 폴더가 있는지, 그 안에 물고기 폴더들이 있는지 확인해주세요.")
    exit()

# 물고기 종류 이름 출력해보기
print(f" 학습할 물고기 종류: {train_generator.class_indices}")

# [3] AI 모델 설계 (전이 학습: MobileNetV2 사용)
# 똑똑한 모델(MobileNetV2)을 빌려옵니다. (include_top=False는 마지막 분류기만 떼고 가져온다는 뜻)
base_model = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base_model.trainable = False # 빌려온 모델은 이미 똑똑하니까 건드리지 않음 (학습 동결)

# 우리 물고기에 맞게 마지막 부분만 개조
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x) # 중간층
predictions = Dense(train_generator.num_classes, activation='softmax')(x) # 최종 결과층 (물고기 종류 개수만큼)

model = Model(inputs=base_model.input, outputs=predictions)

# [4] 학습 방법 설정
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# [5] 학습 시작! (공부해라!)
print("학습을 시작합니다... (시간이 좀 걸립니다)")
history = model.fit(
    train_generator,
    epochs=10, # 공부 횟수 (10번 반복)
    validation_data=validation_generator
)

# [6] 지능 저장 (파일로 내보내기)
print("학습 완료! 모델을 저장합니다.")
model.save('fish_model.h5') # 이 파일이 나중에 main.py에서 쓰입니다.
print("저장 완료: fish_model.h5")