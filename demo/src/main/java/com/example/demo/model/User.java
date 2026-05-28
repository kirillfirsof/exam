package com.example.demo.model;


import java.util.Set;
import java.util.HashSet;



import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "full_name")
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.USER;

 
    @ManyToMany
    @JoinTable(
        name = "user_favorites",                  // промежуточная таблица
        joinColumns = @JoinColumn(name = "user_id"),       // ссылка на пользователя
        inverseJoinColumns = @JoinColumn(name = "product_id")  // ссылка на товар
    )
    @Builder.Default
    private Set<Product> favorites = new HashSet<>();
}