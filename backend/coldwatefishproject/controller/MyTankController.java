package com.example.coldwatefishproject.controller;

import com.example.coldwatefishproject.entity.Fish;
import com.example.coldwatefishproject.entity.Member;
import com.example.coldwatefishproject.entity.MyTank;
import com.example.coldwatefishproject.repository.FishRepository;
import com.example.coldwatefishproject.repository.MemberRepository;
import com.example.coldwatefishproject.repository.MyTankRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * [역할]: 수조 저장, 목록 조회, 물고기 매칭을 모두 처리하는 통합 컨트롤러입니다.
 */
@RestController
@RequestMapping("/api/tanks")
@RequiredArgsConstructor
public class MyTankController {

    private final MyTankRepository myTankRepository;
    private final MemberRepository memberRepository;
    private final FishRepository fishRepository;

    /**
     * [작동 순서 1]: 수조 저장 및 즉시 매칭 결과 반환
     */
    @PostMapping("/save-and-match")
    public List<Fish> saveAndMatch(@RequestBody TankRequestDto request) {
        // 1. 회원 찾기
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다!"));

        // 2. 수조 저장
        MyTank myTank = new MyTank();
        myTank.setMember(member);
        myTank.setTankName(request.getTankName());
        myTank.setTankSize(request.getTankSize());
        myTank.setVolumeLiter(request.getVolumeLiter());
        myTankRepository.save(myTank);

        // 3. 즉시 매칭 물고기 리스트 반환
        return fishRepository.findByMinTankSizeLessThanEqual(request.getVolumeLiter());
    }

    /**
     * [작동 순서 2]: 저장된 수조 목록 불러오기
     */
    @GetMapping("/user/{memberId}")
    public List<MyTank> getMyTanks(@PathVariable Long memberId) {
        return myTankRepository.findByMemberId(memberId);
    }

    @Data
    public static class TankRequestDto {
        private Long memberId;
        private String tankName;
        private String tankSize;
        private Integer volumeLiter;
    }
}