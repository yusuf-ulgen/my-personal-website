package com.yusufulgen.starter.controller;

import com.yusufulgen.starter.dto.response.ApiResponse;
import com.yusufulgen.starter.entity.Project;
import com.yusufulgen.starter.dto.request.ProjectReorderDto;
import com.yusufulgen.starter.service.AuditLogService;
import com.yusufulgen.starter.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Project>>> getAllProjects() {
        return ResponseEntity.ok(ApiResponse.success(projectService.getAllProjects()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Project>>> getActiveProjects() {
        return ResponseEntity.ok(ApiResponse.success(projectService.getActiveProjects()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> createProject(@RequestBody Project project) {
        Project savedProject = projectService.saveProject(project);
        auditLogService.log("PROJECT_CREATED", "Yeni proje eklendi: " + savedProject.getTitle());
        return ResponseEntity.ok(ApiResponse.success(savedProject));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(@PathVariable Long id, @RequestBody Project project) {
        Project updatedProject = projectService.updateProject(id, project);
        auditLogService.log("PROJECT_UPDATED", "Proje güncellendi: " + updatedProject.getTitle());
        return ResponseEntity.ok(ApiResponse.success(updatedProject));
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<ApiResponse<Project>> toggleActiveStatus(@PathVariable Long id) {
        Project updatedProject = projectService.toggleActiveStatus(id);
        auditLogService.log("PROJECT_STATUS_TOGGLED", "Proje aktiflik durumu değiştirildi: " + updatedProject.getTitle() + " - Aktif: " + updatedProject.getIsActive());
        return ResponseEntity.ok(ApiResponse.success(updatedProject));
    }

    @PutMapping("/reorder")
    public ResponseEntity<ApiResponse<String>> reorderProjects(@RequestBody List<ProjectReorderDto> reorderDtos) {
        projectService.reorderProjects(reorderDtos);
        auditLogService.log("PROJECTS_REORDERED", "Projeler yeniden sıralandı.");
        return ResponseEntity.ok(ApiResponse.success("Projeler başarıyla sıralandı."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        auditLogService.log("PROJECT_DELETED", "Proje silindi, ID: " + id);
        return ResponseEntity.ok(ApiResponse.success("Proje başarıyla silindi."));
    }
}