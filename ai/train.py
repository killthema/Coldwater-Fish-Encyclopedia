import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

# [역할] 사진이 들어있는 폴더 경로
DATA_DIR = './dataset'
IMG_SIZE = (224, 224)
BATCH_SIZE = 32

# [작동 순서] 1. 이미지 읽어오기 및 학습/검증 데이터 분리 (8:2)
train_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

train_generator = train_datagen.flow_from_directory(
    DATA_DIR, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
    class_mode='categorical', subset='training')

# [작동 순서] 2. 똑똑한 AI 모델(MobileNetV2) 가져와서 개조하기
base_model = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base_model.trainable = False

x = GlobalAveragePooling2D()(base_model.output)
predictions = Dense(train_generator.num_classes, activation='softmax')(x)
model = Model(inputs=base_model.input, outputs=predictions)

# [작동 순서] 3. 학습 시작! (이 과정이 끝나야 '뇌'가 만들어집니다)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(train_generator, epochs=10)

# [역할] 학습된 결과(지능)를 파일로 저장합니다.
model.save('fish_model.h5')
print("성공! fish_model.h5 파일이 생성되었습니다.")