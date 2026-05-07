package com.yusufulgen.starter.repository;

import com.yusufulgen.starter.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findAllByOrderByOrderIndexAsc();
    List<Project> findByIsActiveTrueOrderByOrderIndexAsc();
}