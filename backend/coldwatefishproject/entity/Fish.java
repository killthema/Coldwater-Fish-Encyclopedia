package com.example.coldwatefishproject.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "fish_species") // [중요] 테이블 이름 일치
public class Fish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "species_id") // [중요] DB의 species_id 와 연결
    private Long id;

    @Column(name = "species_name") // [중요] DB의 species_name 와 연결
    private String name;
    // 리액트에서 fish.name으로 쓸 수 있게 변수명은 name으로 했습니다.

    @Column(name = "group_type") // 사육 형태 (집단/단독)
    private String groupType;

    @Column(name = "min_count") // 최소 사육 마리수
    private Integer minCount;

    @Column(name = "habitat") // 서식지
    private String habitat;

    @Column(name = "temp_min") // 최저 수온 (예: 10.5)
    private Double tempMin;

    @Column(name = "temp_max") // 최고 수온 (예: 20.0)
    private Double tempMax;

    @Column(name = "description") // 상세 설명
    private String description;

    @Column(name = "min_tank_size")
    private Integer minTankSize;

    // [팁] 리액트가 'temp'를 찾을 때를 대비한 보너스 기능
    // fish.temp 라고 부르면 "10.5 ~ 20.0" 형태로 합쳐서 준다
    public String getTemp() {
        return tempMin + " ~ " + tempMax;
    }


}