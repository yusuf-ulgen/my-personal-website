package com.yusufulgen.starter.service;

import com.yusufulgen.starter.dto.request.ReferenceReorderDto;
import com.yusufulgen.starter.entity.Reference;
import com.yusufulgen.starter.repository.ReferenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReferenceService {

    @Autowired
    private ReferenceRepository referenceRepository;

    public List<Reference> getAllReferences() {
        return referenceRepository.findAll();
    }

    @SuppressWarnings("null")
    public Reference saveReference(Reference reference) {
        return referenceRepository.save(reference);
    }

    @SuppressWarnings("null")
    public Reference updateReference(Long id, Reference updatedReference) {
        Reference existingReference = referenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Referans bulunamadı, ID: " + id));

        existingReference.setFullName(updatedReference.getFullName());
        existingReference.setTitle(updatedReference.getTitle());
        existingReference.setTitleEn(updatedReference.getTitleEn());
        existingReference.setCompany(updatedReference.getCompany());
        existingReference.setCompanyEn(updatedReference.getCompanyEn());
        existingReference.setCity(updatedReference.getCity());
        existingReference.setEmail(updatedReference.getEmail());
        existingReference.setPhone(updatedReference.getPhone());
        if (updatedReference.getOrderIndex() != null) {
            existingReference.setOrderIndex(updatedReference.getOrderIndex());
        }

        return referenceRepository.save(existingReference);
    }

    @SuppressWarnings("null")
    public void deleteReference(Long id) {
        referenceRepository.deleteById(id);
    }

    @SuppressWarnings("null")
    public void reorderReferences(List<ReferenceReorderDto> requestList) {
        for (ReferenceReorderDto request : requestList) {
            Reference reference = referenceRepository.findById(request.getId()).orElse(null);
            if (reference != null) {
                reference.setOrderIndex(request.getOrderIndex());
                referenceRepository.save(reference);
            }
        }
    }
}
