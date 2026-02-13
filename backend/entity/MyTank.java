package com.example.coldwatefishproject.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@Table(name = "my_tanks") // DB 테이블 이름과 일치
public class MyTank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tank_id")
    private Long id;

    // [외래키 연결] 회원 정보
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "tank_name")
    private String tankName; // "내 메인 어항"

    // [외래키 연결] 현재 키우고 있는 어종 (없을 수도 있음)
    @ManyToOne
    @JoinColumn(name = "species_id")
    private Fish fish;

    @Column(name = "tank_size")
    private String tankSize; // "60x45x45" 같은 문자열 저장



    @Column(name = "volume_liter")
    private Integer volumeLiter;

    @Column(name = "ai_recognition_result")
    private String aiResult;

    @Column(name = "memo")
    private String memo;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;
}