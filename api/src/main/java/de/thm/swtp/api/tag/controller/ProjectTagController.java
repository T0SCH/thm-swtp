package de.thm.swtp.api.tag.controller;

import de.thm.swtp.api.project.Project;
import de.thm.swtp.api.project.ProjectRepository;
import de.thm.swtp.api.tag.entity.TagEntity;
import de.thm.swtp.api.tag.service.ProjectTagService;
import de.thm.swtp.api.tool.OwnershipVerifier;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/projects/{projectId}/tags")
@RequiredArgsConstructor
public class ProjectTagController {

    private final ProjectTagService projectTagService;
    private final ProjectRepository projectRepository;

    @PostMapping
    public ResponseEntity<TagEntity> addTag(@PathVariable UUID projectId,
                                            @AuthenticationPrincipal Jwt jwt,
                                            @RequestBody AddProjectTagRequest request) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow();

        OwnershipVerifier.verify(project.getOwner().getUsername(), jwt);

        return ResponseEntity.ok(
                projectTagService.addTagToProject(projectId, request)
        );
    }
}