package com.example.coldwatefishproject.controller;

import com.example.coldwatefishproject.entity.Member;
import com.example.coldwatefishproject.entity.MyTank;
import com.example.coldwatefishproject.repository.MemberRepository;
import com.example.coldwatefishproject.repository.MyTankRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tanks") // 리액트가 호출할 주소의 대문
@RequiredArgsConstructor
public class MyTankController {

    private final MyTankRepository myTankRepository; // 수조 저장소
    private final MemberRepository memberRepository; // 회원 저장소 (누구 수조인지 알아야 하니까)

    // ==========================================================
    // 1. 내 수조 저장하기 (POST)
    // 리액트 요청: axios.post('http://localhost:8090/api/tanks', tankData)
    // ==========================================================
    @PostMapping
    public String saveMyTank(@RequestBody TankRequestDto request) {

        // 1. 회원 찾기 (누가 저장하는 건지?)
        // 리액트에서 보낸 memberId(예: 1)로 실제 회원을 찾습니다.
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다!"));

        // 2. 수조 엔티티 만들기 (데이터 옮겨 담기)
        MyTank myTank = new MyTank();
        myTank.setMember(member);            // 주인 설정
        myTank.setTankName(request.getTankName()); // "거실 어항"
        myTank.setTankSize(request.getTankSize()); // "60x30x40"
        myTank.setVolumeLiter(request.getVolumeLiter()); // 72 (리터)

        // 3. 저장소에 저장!
        myTankRepository.save(myTank);

        return "수조가 성공적으로 저장되었습니다! (ID: " + myTank.getId() + ")";
    }

    // ==========================================================
    // 2. 내 수조 목록 불러오기 (GET)
    // 주소: /api/tanks/user/1  (1번 회원의 수조 다 가져와)
    // ==========================================================
    @GetMapping("/user/{memberId}")
    public List<MyTank> getMyTanks(@PathVariable Long memberId) {
        return myTankRepository.findByMemberId(memberId);
    }

    // ==========================================================
    // [DTO] 리액트에서 오는 데이터를 받을 그릇 (내부 클래스)
    // ==========================================================
    @Data
    public static class TankRequestDto {
        private Long memberId;      // 회원 번호
        private String tankName;    // 수조 이름
        private String tankSize;    // 크기 (문자열)
        private Integer volumeLiter; // 물 용량 (숫자)
    }
}