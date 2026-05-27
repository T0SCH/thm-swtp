package de.thm.swtp.api.project.exception;

import java.util.*;

public class ExceptionProjectAlreadyDeleted extends RuntimeException{

    public ExceptionProjectAlreadyDeleted(UUID projectId) {
        super("Das Projekt mit der ID " + projectId + " wurde bereits gelöscht.");
    }
}
