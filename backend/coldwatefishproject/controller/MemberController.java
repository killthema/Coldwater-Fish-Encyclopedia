package com.example.coldwatefishproject.controller;

import com.example.coldwatefishproject.entity.Member;
import com.example.coldwatefishproject.repository.MemberRepository;
import com.example.coldwatefishproject.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // [역할]: 리액트(5173)의 접속을 허락함 [cite: 2026-01-06]
public class MemberController {

    private final MemberRepository memberRepository;
    private final MailService mailService;

    // 1. 로그인 (사라졌던 문을 다시 만듭니다!)
    @PostMapping("/login")
    public String login(@RequestBody Member member) {
        // [작동 순서]: 1. 아이디로 DB 조회 -> 2. 비번 대조 -> 3. 결과 반환 [cite: 2026-01-06]
        Member foundMember = memberRepository.findByUsername(member.getUsername()).orElse(null);

        if (foundMember == null) return "로그인 실패: 아이디가 존재하지 않습니다.";
        if (!foundMember.getPassword().equals(member.getPassword())) return "로그인 실패: 비밀번호가 틀렸습니다.";

        return "로그인 성공! " + foundMember.getNickname() + "님 어서오세요";
    }

    // 2. 비밀번호 찾기 (아까 성공했던 로직 그대로)
    @PostMapping("/find-pw")
    public String findPw(@RequestBody Member member) {
        Member foundMember = memberRepository.findByUsernameAndEmail(member.getUsername(), member.getEmail())
                .orElse(null);

        if (foundMember == null) return "정보가 일치하지 않습니다.";

        mailService.sendEmail(foundMember.getEmail(), "[ColdwaterFish] 비밀번호 안내",
                foundMember.getNickname() + "님! 비번은 [" + foundMember.getPassword() + "] 입니다.");
        return "메일로 비밀번호를 발송했습니다.";
    }

    // 3. 아이디 찾기
    @PostMapping("/find-id")
    public String findId(@RequestBody Member member) {
        Member foundMember = memberRepository.findByEmail(member.getEmail()).orElse(null);
        if (foundMember == null) return "일치하는 정보가 없습니다.";

        mailService.sendEmail(foundMember.getEmail(), "[ColdwaterFish] 아이디 안내",
                "아이디는 [" + foundMember.getUsername() + "] 입니다.");
        return "메일로 아이디를 발송했습니다.";
    }
}