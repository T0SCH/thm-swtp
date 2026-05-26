package de.thm.swtp.api.tag.service;

import de.thm.swtp.api.project.Project;
import de.thm.swtp.api.project.ProjectRepository;
import de.thm.swtp.api.project.exception.ProjectNotFoundException;
import de.thm.swtp.api.tag.domain.Tag;
import de.thm.swtp.api.tag.entity.TagEntity;
import de.thm.swtp.api.tag.mapper.TagMapper;
import de.thm.swtp.api.tag.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectTagService {

    private final TagRepository tagRepository;
    private final ProjectRepository projectTagRepository;


    /** Returns a list of all tags assigned to the given project. */
    @Transactional(readOnly = true)
    public List<Tag> getProjectTags(UUID projectId) {
        Project projectEntity = projectTagRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        return projectEntity.getTags()
                .stream()
                .map(TagMapper::toDomain)
                .toList();
    }

    /** Assigns a tag to the given project. If the tag does not exist, then it will be created and then assigned. */
    @Transactional
    public Tag addTagToProject(UUID projectId, String tagName) {
        Project project = projectTagRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException(projectId));

        TagEntity tagEntity = getOrCreateTag(tagName);
        project.getTags().add(tagEntity);

        return TagMapper.toDomain(tagEntity);
    }


    private TagEntity getOrCreateTag(String tagName) {
        String cleaned = tagName.trim();

        return tagRepository.findByNameIgnoreCase(cleaned)
                .orElseGet(() -> tagRepository.save(new TagEntity(cleaned)));
    }
}
