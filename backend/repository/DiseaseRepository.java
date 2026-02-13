package com.example.coldwatefishproject.repository;

import com.example.coldwatefishproject.entity.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface DiseaseRepository extends JpaRepository<Disease, Long> {

    List<Disease> findBySymptomsContaining(String keyword);

}
