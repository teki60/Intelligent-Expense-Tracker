package org.expensetracker.exceptions;

public class UserException extends RuntimeException {
    public UserException(String message) {
        super(message);
    }
}
