package com.yusufulgen.starter.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // Projenin adı

    @Column(columnDefinition = "TEXT")
    private String description; // Proje açıklaması

    private String technologies; // Kullanılan teknolojiler (Örn: "Java, React, Tailwind")

    private String duration; // Ne kadar sürede yapıldı (Örn: "2 Hafta", "3 Ay")

    private String githubUrl; // GitHub kaynak kod linki
    private String liveUrl; // Varsa canlı site linki (Eski alan, uyumluluk için durabilir)
    private String webUrl; // Web sitesi linki
    private String mobileUrl; // Mobil uygulama linki (Play Store / App Store vb.)

    private String titleEn; // İngilizce Başlık
    
    @Column(columnDefinition = "TEXT")
    private String descriptionEn; // İngilizce Açıklama

    @Column(nullable = false, columnDefinition = "boolean default true")
    private Boolean isActive = true;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private Integer orderIndex = 0;
}