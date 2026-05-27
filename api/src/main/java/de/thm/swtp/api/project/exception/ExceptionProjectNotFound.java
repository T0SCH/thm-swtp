package de.thm.swtp.api.project.exception;

import java.util.*;

public class ExceptionProjectNotFound extends RuntimeException{
    public ExceptionProjectNotFound(UUID projectId) {
            super("Kein Projekt mit der ID " + projectId + " gefunden.");
        }
}
