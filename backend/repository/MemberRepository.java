package com.example.coldwatefishproject.repository;

import com.example.coldwatefishproject.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    // 1. 아이디로 찾기
    Optional<Member> findByUsername(String username);

    // 2. 이메일로 찾기
    Optional<Member> findByEmail(String email);

    // 3. 아이디랑 이메일 둘 다 맞는 거 찾기
    Optional<Member> findByUsernameAndEmail(String username, String email);
}
