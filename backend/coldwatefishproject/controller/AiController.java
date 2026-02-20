package com.example.coldwatefishproject.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.Map;

/**
 * [역할]: AI 상담 및 가이드 요청을 처리하는 컨트롤러입니다.
 * 리액트(Front)와 파이썬(AI) 사이의 통신을 중계하는 '미들웨어' 역할을 합니다.
 */
@RestController
@RequestMapping("/api/fish-ai")
@CrossOrigin(origins = "http://localhost:3000") // 리액트의 접근을 허용합니다.
public class AiController {


    @PostMapping("/ask")
    public ResponseEntity<Map<String, Object>> askToAi(@RequestBody Map<String, String> requestData) {

        // [역할]: 외부 API(파이썬 서버)와 통신하기 위한 스프링 내장 도구입니다.
        RestTemplate restTemplate = new RestTemplate();

        // [설정]: 파이썬 Flask 서버의 주소입니다.
        String pythonUrl = "http://localhost:5000/api/ai/advice";

        try {
            // [작동 순서]: 파이썬 서버에 데이터를 쏘고(POST), 결과 데이터를 Map 형태로 받아옵니다.
            Map<String, Object> response = restTemplate.postForObject(pythonUrl, requestData, Map.class);

            // 성공적으로 데이터를 받으면 리액트에게 전달합니다.
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // [역할]: 파이썬 서버가 꺼져있거나 통신 에러가 났을 때 예외 처리를 담당합니다.
            return ResponseEntity.internalServerError().body(Map.of("status", "fail", "message", e.getMessage()));
        }
    }
}