package com.yusufulgen.starter.controller;

import com.yusufulgen.starter.dto.request.ReferenceReorderDto;
import com.yusufulgen.starter.dto.response.ApiResponse;
import com.yusufulgen.starter.entity.Reference;
import com.yusufulgen.starter.service.ReferenceService;
import com.yusufulgen.starter.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/references")
public class ReferenceController {

    @Autowired
    private ReferenceService referenceService;

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Reference>>> getAllReferences() {
        return ResponseEntity.ok(ApiResponse.success(referenceService.getAllReferences()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Reference>> createReference(@RequestBody Reference reference) {
        Reference savedReference = referenceService.saveReference(reference);
        auditLogService.log("REFERENCE_CREATED", "Yeni referans eklendi: " + savedReference.getFullName());
        return ResponseEntity.ok(ApiResponse.success(savedReference));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Reference>> updateReference(@PathVariable Long id, @RequestBody Reference reference) {
        Reference updatedReference = referenceService.updateReference(id, reference);
        auditLogService.log("REFERENCE_UPDATED", "Referans güncellendi: " + updatedReference.getFullName());
        return ResponseEntity.ok(ApiResponse.success(updatedReference));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteReference(@PathVariable Long id) {
        referenceService.deleteReference(id);
        auditLogService.log("REFERENCE_DELETED", "Referans silindi, ID: " + id);
        return ResponseEntity.ok(ApiResponse.success("Referans başarıyla silindi."));
    }

    @PostMapping("/reorder")
    public ResponseEntity<ApiResponse<String>> reorderReferences(@RequestBody List<ReferenceReorderDto> request) {
        referenceService.reorderReferences(request);
        auditLogService.log("REFERENCE_REORDERED", "Referans listesi yeniden sıralandı");
        return ResponseEntity.ok(ApiResponse.success("Sıralama güncellendi."));
    }
}
