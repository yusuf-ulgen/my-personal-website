package com.yusufulgen.starter.service;

import com.yusufulgen.starter.entity.Project;
import com.yusufulgen.starter.repository.ProjectRepository;
import com.yusufulgen.starter.dto.request.ProjectReorderDto;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private ProjectRepository projectRepository;

    // Tüm projeleri getir (Admin panel için, sıralı)
    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderByOrderIndexAsc();
    }

    // Aktif projeleri getir (Frontend için, sıralı)
    public List<Project> getActiveProjects() {
        return projectRepository.findByIsActiveTrueOrderByOrderIndexAsc();
    }

    // Yeni proje kaydet
    @SuppressWarnings("null")
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    // Proje güncelle
    @SuppressWarnings("null")
    public Project updateProject(Long id, Project updatedProject) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proje bulunamadı, ID: " + id));

        existingProject.setTitle(updatedProject.getTitle());
        existingProject.setTitleEn(updatedProject.getTitleEn());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setDescriptionEn(updatedProject.getDescriptionEn());
        existingProject.setTechnologies(updatedProject.getTechnologies());
        existingProject.setDuration(updatedProject.getDuration());
        existingProject.setGithubUrl(updatedProject.getGithubUrl());
        existingProject.setLiveUrl(updatedProject.getLiveUrl());
        
        if (updatedProject.getIsActive() != null) {
            existingProject.setIsActive(updatedProject.getIsActive());
        }
        if (updatedProject.getOrderIndex() != null) {
            existingProject.setOrderIndex(updatedProject.getOrderIndex());
        }

        return projectRepository.save(existingProject);
    }

    // Aktiflik durumunu değiştir
    @SuppressWarnings("null")
    public Project toggleActiveStatus(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proje bulunamadı, ID: " + id));
        
        project.setIsActive(!project.getIsActive());
        return projectRepository.save(project);
    }

    // Projeleri yeniden sırala
    @Transactional
    public void reorderProjects(List<ProjectReorderDto> reorderDtos) {
        for (ProjectReorderDto dto : reorderDtos) {
            Project project = projectRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Proje bulunamadı, ID: " + dto.getId()));
            project.setOrderIndex(dto.getOrderIndex());
            projectRepository.save(project);
        }
    }

    // Proje sil
    @SuppressWarnings("null")
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
        auditLogService.log("DELETE_PROJECT", "ID: " + id + " olan proje silindi.");
    }
}