package com.example.coldwatefishproject.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FishService {

    private final RestTemplate restTemplate = new RestTemplate(); // 파이썬에게 전화 거는 전화기

    // [핵심 기능] 사진을 파이썬 서버로 보내고, 물고기 이름을 받아옴
    public String predictFishSpecies(MultipartFile file) {
        try {
            // 1. 파이썬 서버 주소 (아까 파이참에서 켠 서버)
            String pythonUrl = "http://127.0.0.1:8000/predict";

            // 2. 사진을 봉투에 담기 (헤더와 바디 설정)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            // 사진 파일을 바이트 배열로 변환해서 넣기
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename(); // 파일 이름 유지
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // 3. 파이썬에게 전송! (POST 요청)
            ResponseEntity<String> response = restTemplate.postForEntity(pythonUrl, requestEntity, String.class);

            // 4. 파이썬이 준 응답(JSON) 뜯어보기
            // 예: {"species": "무지개 송어", "confidence": "98.5%"}
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response.getBody());

            String species = root.path("species").asText(); // "무지개 송어" 추출
            System.out.println("AI 판독 결과: " + species);

            return species;

        } catch (Exception e) {
            e.printStackTrace();
            return "판독 실패";
        }
    }
}