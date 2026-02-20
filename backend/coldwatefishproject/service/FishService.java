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

    // [역할]: 파이썬 AI 서버와 통신하기 위한 도구입니다.
    private final RestTemplate restTemplate = new RestTemplate();



    public String predictFishSpecies(MultipartFile file) {
        try {

            String pythonUrl = "http://127.0.0.1:5000/predict";

            // [역할]: 멀티파트(사진 데이터) 전송을 위한 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // [작동]: 사진 데이터를 봉투(Body)에 담습니다.
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // [작동]: 파이썬 서버로 사진을 보내고 응답을 기다립니다.
            ResponseEntity<String> response = restTemplate.postForEntity(pythonUrl, requestEntity, String.class);

            // [작동]: 파이썬이 준 JSON에서 데이터를 꺼냅니다.
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response.getBody());

            // [수정 2]: 파이썬 코드상 key 이름이 "name"입니다.
            String species = root.path("name").asText();

            System.out.println(" 자바 서버가 받은 AI 판독 결과: " + species);

            return species;

        } catch (Exception e) {
            // [역할]: 연결 실패나 분석 오류 시 로그를 찍고 '판독 실패'를 반환합니다.
            System.err.println(" AI 서버 통신 중 에러 발생: " + e.getMessage());
            return "판독 실패";
        }
    }
}