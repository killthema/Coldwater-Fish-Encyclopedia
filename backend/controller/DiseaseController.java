package com.example.coldwatefishproject.controller;

import com.example.coldwatefishproject.entity.Disease;
import com.example.coldwatefishproject.repository.DiseaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dieases")
@CrossOrigin(origins = "http://local:5173")
@RequiredArgsConstructor

public class DiseaseController {

    private final DiseaseRepository diseaseRepository;

    @GetMapping
    public List<Disease> getAllDiseases() {
        return diseaseRepository.findAll();
    }

}
