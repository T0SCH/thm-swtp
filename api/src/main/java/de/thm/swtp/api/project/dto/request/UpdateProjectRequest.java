package de.thm.swtp.api.project.dto.request;

import lombok.*;

@Data
public class UpdateProjectRequest {
    private String name;
    private String description;
    private String projectUrl;
    private boolean isPrivateProject;
}
