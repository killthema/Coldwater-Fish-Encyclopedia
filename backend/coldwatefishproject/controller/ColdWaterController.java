package com.example.coldwatefishproject.controller;

import com.example.coldwatefishproject.entity.Fish;
import com.example.coldwatefishproject.repository.FishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fish") // [중요] 주소 확인!
@RequiredArgsConstructor
public class ColdWaterController {

    private final FishRepository fishRepository;

    // 1. 전체 목록 (기존 기능)
    @GetMapping
    public List<Fish> getAllFish() {
        return fishRepository.findAll();
    }

    // 2. 검색 (기존 기능)
    @GetMapping("/search")
    public List<Fish> searchFish(@RequestParam String keyword) {
        return fishRepository.findByNameContaining(keyword);
    }


    // 3. 수조 크기별 추천 (새로 추가할 기능)
    @GetMapping("/recommend")
    public Object recommendFish(
            @RequestParam int width,
            @RequestParam int depth,
            @RequestParam int height,
            @RequestParam(required = false) String userId
    ) {
        // 1. 물의 양 계산
        int tankLiter = (width * depth * height) / 1000;
        System.out.println("요청 들어옴! 계산된 리터: " + tankLiter); // 콘솔에 찍어보기

        // 2. DB에서 찾기 (findByMinTankSizeLessThanEqual 메서드가 Repository에 있어야 함!)
        return fishRepository.findByMinTankSizeLessThanEqual(tankLiter);
    }
}