package de.thm.swtp.api.project;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;
import java.util.List;

public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, UUID id);

    Optional<ProjectEntity> findByProjectUrl(String projectUrl);

    List<ProjectEntity> findAllByOwner_UsernameAndDeletedAtIsNullOrderByCreatedAtDesc(String username);
}