package com.example.coldwatefishproject.repository;

import com.example.coldwatefishproject.entity.Fish;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional; // [1] 이 줄이 꼭 필요합니다! (알트+엔터로 추가 가능)

public interface FishRepository extends JpaRepository<Fish, Long> {

    // 1. 검색용 (예: '송어' 검색 -> 무지개 송어, 브라운 송어 다 나옴)
    List<Fish> findByNameContaining(String name);

    // 2. 어항 크기 필터링
    List<Fish> findByMinTankSizeLessThanEqual(Integer size);

    // AI용 (정확한 이름 찾기)
    // 예: AI가 "무지개 송어"라고 하면 딱 그 물고기 한 마리만 가져옴
    Optional<Fish> findByName(String name);

}