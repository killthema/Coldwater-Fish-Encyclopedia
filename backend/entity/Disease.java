package com.example.coldwatefishproject.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "fish-disease")


public class Disease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "disease_id")
    private Long id;


    @Column (name = "disease_name")
    private String name;

    @Column (name = "symptoms")
    private String symptoms;


    @Column(name = "treatment") // DB 컬럼: treatment
    private String treatment;






}


