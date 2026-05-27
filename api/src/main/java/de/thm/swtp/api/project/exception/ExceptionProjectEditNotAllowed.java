package de.thm.swtp.api.project.exception;

import java.util.*;

public class ExceptionProjectEditNotAllowed extends RuntimeException{

    public ExceptionProjectEditNotAllowed(UUID userId, UUID projectId) {
        super("Benutzer " + userId + " hat keine Berechtigung, das Projekt " + projectId + " zu bearbeiten.");
    }
}
