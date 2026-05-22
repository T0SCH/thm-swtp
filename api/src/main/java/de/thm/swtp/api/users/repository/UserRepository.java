package de.thm.swtp.api.users.repository;

import de.thm.swtp.api.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByKeycloakId(String keycloakId);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
}
