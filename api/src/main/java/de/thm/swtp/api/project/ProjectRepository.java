package de.thm.swtp.api.project;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {
    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, UUID id);

    Optional<ProjectEntity> findByProjectUrl(String projectUrl);
}