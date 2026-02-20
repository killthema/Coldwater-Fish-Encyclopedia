package com.example.coldwatefishproject.controller;

import com.example.coldwatefishproject.entity.FishCompatibility;
import com.example.coldwatefishproject.repository.CompatibilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap; // [필수]: 데이터가 없을 때 Map을 만들기 위해 필요합니다.
import java.util.List;    // [필수]: 리스트를 처리하기 위해 필요합니다.
import java.util.Map;

@RestController
@RequestMapping("/api/compatibility")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CompatibilityController {

    private final CompatibilityRepository compatibilityRepository;


    @GetMapping
    public ResponseEntity<?> checkCompatibility(@RequestParam String a, @RequestParam String b) {
        // [코드의 역할]: DB에서 데이터를 리스트 형태로 가져옵니다.
        List<FishCompatibility> results = compatibilityRepository.findCompatibility(a, b);

        // [문제 해결]: Optional의 isPresent() 대신 List의 !isEmpty()를 사용합니다.
        if (!results.isEmpty()) {
            // 데이터가 있을 때: 가장 첫 번째(0번) 결과물을 꺼내서 보냅니다.
            return ResponseEntity.ok(results.get(0));
        } else {
            // 데이터가 없을 때: 리액트가 읽을 수 있는 JSON 객체를 만들어 보냅니다.
            Map<String, String> response = new HashMap<>();
            response.put("status", "정보 없음");
            response.put("reason", "아직 등록되지 않은 조합입니다.");
            return ResponseEntity.ok(response);
        }
    }
}