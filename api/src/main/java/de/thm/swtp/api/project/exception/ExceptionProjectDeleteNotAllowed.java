package de.thm.swtp.api.project.exception;

import java.util.*;

public class ExceptionProjectDeleteNotAllowed extends RuntimeException{

    public ExceptionProjectDeleteNotAllowed(UUID userId, UUID projectId) {
        super("Benutzer " + userId + " hat keine Berechtigung das Projekt " + projectId + " zu löschen.");
    }
}
