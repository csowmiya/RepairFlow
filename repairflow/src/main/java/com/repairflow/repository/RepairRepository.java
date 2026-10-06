package com.repairflow.repository;

import com.repairflow.entity.Repair;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepairRepository extends JpaRepository<Repair, Long> {

    List<Repair> findByCustomerEmail(String email);
    List<Repair> findByTechnicianEmail(String email);
}