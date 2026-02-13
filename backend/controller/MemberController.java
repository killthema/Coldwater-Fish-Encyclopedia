package com.example.coldwatefishproject.controller;

import com.example.coldwatefishproject.entity.Member;
import com.example.coldwatefishproject.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor

public class MemberController {

    private final MemberRepository memberRepository;

    // 1. 회원가입
    @PostMapping("/signup")
    public String signup(@RequestBody Member member) {
        if (member.getPassword() == null || member.getPassword().isEmpty()) {
            return "비밀번호를 입력해야 합니다!";
        }
        member.setRole("USER");
        memberRepository.save(member);
        return "회원가입 성공! 환영합니다, " + member.getNickname() + "님!";
    }

    // 2. 로그인
    @PostMapping("/login")
    public String login(@RequestBody Member member) {
        Member foundMember = memberRepository.findByUsername(member.getUsername())
                .orElse(null);

        if(foundMember == null){
            return "로그인 실패: 아이디가 존재하지 않습니다.";
        }
        if(!foundMember.getPassword().equals(member.getPassword())){
            return "로그인 실패: 비밀번호가 틀렸습니다.";
        }
        return "로그인 성공! " + foundMember.getNickname() + "님 어서오세요";
    }

    // 3. 아이디 찾기
    @PostMapping("/find-id")
    public String findId(@RequestBody Member member) {
        Member foundMember = memberRepository.findByEmail(member.getEmail())
                .orElse(null);
        if (foundMember == null) {
            return "입력하신 이메일로 가입된 아이디가 없습니다.";
        }
        return "찾으시는 아이디는 [" + foundMember.getUsername() + "] 입니다.";
    }

    // 4. 비밀번호 찾기
    @PostMapping("/find-pw")
    public String findPw(@RequestBody Member member) {
        Member foundMember = memberRepository.findByUsernameAndEmail(member.getUsername(), member.getEmail())
                .orElse(null);
        if (foundMember == null) {
            return "정보가 일치하지 않습니다. 아이디와 이메일을 확인해주세요.";
        }
        return "회원님의 비밀번호는 [" + foundMember.getPassword() + "] 입니다.";
    }
}