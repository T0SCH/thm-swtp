package de.thm.swtp.api.project.exception;


public class ExceptionProjectNameAlreadyExists extends RuntimeException{

    public ExceptionProjectNameAlreadyExists(String name) {
        super("Ein Projekt mit dem Namen " + name + " existiert bereits.");
    }
}
