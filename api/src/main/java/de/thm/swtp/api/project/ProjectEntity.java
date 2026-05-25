package de.thm.swtp.api.project;


import jakarta.persistence.*;
import lombok.*;
import de.thm.swtp.api.userprofile.entity.UserProfile;
import java.util.*;
import org.hibernate.annotations.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity(name = "projects")
@Table(name = "projects")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name="project_url", nullable = false, length = 30)
    private String projectUrl;

    @Column(name="is_private", nullable = false)
    @Builder.Default
    private boolean isPrivateProject=false;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private UserProfile owner;

    @ManyToMany
    @JoinTable(
            name = "project_members",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )

    @Builder.Default
    private Set<UserProfile> members = new HashSet<>();

    // Misses Join to TagEntity for project-tags. ManyToMany should work.

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

}
