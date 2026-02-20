package com.example.coldwatefishproject.controller;

import com.example.coldwatefishproject.entity.Fish;
import com.example.coldwatefishproject.repository.FishRepository;
import com.example.coldwatefishproject.service.FishService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * [역할]: 리액트(웹사이트)와 소통하는 핵심 관리자
 * 1. 도감 목록 보여주기
 * 2. 이름으로 검색하기
 * 3. AI 사진 판독 요청 처리하기 (핵심!)
 */
@RestController
@RequestMapping("/api/fish-list")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RequiredArgsConstructor
public class FishController {

    private final FishRepository fishRepository; // DB 담당
    private final FishService fishService;       // AI 담당

    /**
     * [1. 전체 조회]: 도감 메인 화면에 20마리 다 보여주기
     * 주소: GET /api/fish-list
     */
    @GetMapping
    public List<Fish> getAllFish() {
        return fishRepository.findAll();
    }

    /**
     * [2. 검색 기능]: 이름으로 물고기 찾기
     * 주소: GET /api/fish-list/search?keyword=송어
     */
    /**
     * [2. 검색 기능]: 이름으로 물고기 찾기

     */
    @GetMapping("/search")
// [수정] 리액트가 보내는 'name'이라는 글자를 'keyword' 변수에 담으라고 강제 지정합니다.
    public List<Fish> searchFish(@RequestParam("keyword") String keyword) {
        return fishRepository.findByNameContaining(keyword);
    }

    /**
     * [3. AI 판독 기능]: 사진을 보내면 AI에게 물어보고 결과를 줌
     * 주소: POST /api/fish-list/predict
     */
    @PostMapping("/predict")
    public ResponseEntity<?> predictFish(@RequestParam("file") MultipartFile file) {

        System.out.println(" [요청 도착] 사진 판독을 시작합니다...");

        // 1. 파이썬(AI)에게 사진 보내서 물어보기
        String speciesName = fishService.predictFishSpecies(file);
        System.out.println(" AI 분석 결과: " + speciesName);

        // 2. AI 서버가 꺼져있거나 오류가 난 경우
        if (speciesName == null || speciesName.equals("판독 실패")) {
            return ResponseEntity.status(500).body("AI 서버와 연결할 수 없습니다. (파이썬 켜져있나요?)");
        }

        Map<String, Object> responseMap = new HashMap<>();

        // 3. [추가된 기능] AI가 "물고기 아님"이라고 판단했을 때 (점수 70점 미만)
        if (speciesName.equals("물고기 아님")) {
            responseMap.put("name", "판독 불가");
            responseMap.put("description",
                    " 이거 물고기 아닌거 같은데요?.\n\n" +
                            "1. 물고기가 정면이나 측면으로 잘 나왔나요?\n" +
                            "2. 혹시 사람, 고양이, 풍경 사진은 아닌가요?\n\n" +
                            "물고기 사진만 올려주십시오. ");
            responseMap.put("habitat", "-");
            responseMap.put("tempMin", 0);
            responseMap.put("tempMax", 0);
            responseMap.put("minTankSize", 0);

            return ResponseEntity.ok(responseMap);
        }

        // 4. DB에서 해당 물고기 정보 찾기
        Optional<Fish> fish = fishRepository.findByName(speciesName);

        if (fish.isPresent()) {
            // Case A: DB에 정보가 있으면 그 정보를 그대로 준다
            return ResponseEntity.ok(fish.get());
        } else {
            // Case B: AI는 맞췄는데, DB에 상세 설명이 없을 때 -> 안내 메시지를 만들어서 준다
            responseMap.put("name", speciesName);

            // 줄바꿈(\n)을 넣어서 보기 좋게 설명
            responseMap.put("description",
                    " AI는 이 물고기를 '" + speciesName + "'(으)로 분석했습니다.\n" +
                            "다만, 현재 도감 DB에 아직 상세 정보가 등록되지 않았네요.\n\n" +
                            " 위쪽 '이름으로 찾기' 검색창에 이름을 직접 입력해보시면\n" +
                            "관련된 다른 정보를 찾으실 수도 있습니다!");

            responseMap.put("habitat", "데이터 없음");
            responseMap.put("tempMin", 0);
            responseMap.put("tempMax", 0);
            responseMap.put("minTankSize", 0);

            return ResponseEntity.ok(responseMap);
        }
    }
}