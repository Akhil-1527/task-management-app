package com.taskmanager.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a Task entity for the Task Management System.
 * This class maps to the 'tasks' table in the database.
 */
@Entity
@Table(name = "tasks")
public class Task {

    /** Unique identifier for the task (Primary Key). */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Title of the task (Required). */
    @Column(nullable = false)
    private String title;

    /** Description of the task. */
    @Column(nullable = false)
    private String description;

    /** Boolean flag indicating if the task is completed. */
    private boolean completed;

    /** Due date of the task. */
    private LocalDateTime dueDate;

    /** Default constructor (required by JPA). */
    public Task() {}

    /**
     * Parameterized constructor for creating a Task entity.
     *
     * @param title       The title of the task.
     * @param description The description of the task.
     * @param completed   The status of the task (completed or not).
     * @param dueDate     The due date of the task.
     */
    public Task(String title, String description, boolean completed, LocalDateTime dueDate) {
        this.title = title;
        this.description = description;
        this.completed = completed;
        this.dueDate = dueDate;
    }

    /** Getter and Setter Methods */
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
}
