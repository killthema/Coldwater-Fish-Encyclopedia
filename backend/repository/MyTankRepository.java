package com.example.coldwatefishproject.repository;

import com.example.coldwatefishproject.entity.MyTank;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MyTankRepository extends JpaRepository<MyTank, Long> {

    // 특정 회원의 수조만 싹 긁어오는 명령어 추가
    List<MyTank> findByMemberId(Long memberId);
}