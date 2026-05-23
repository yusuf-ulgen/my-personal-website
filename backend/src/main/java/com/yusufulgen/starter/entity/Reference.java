package com.yusufulgen.starter.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "references")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String title;

    private String titleEn;

    @Column(nullable = false)
    private String company;

    private String companyEn;

    private String city;

    private String email;

    private String phone;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 0;
}
