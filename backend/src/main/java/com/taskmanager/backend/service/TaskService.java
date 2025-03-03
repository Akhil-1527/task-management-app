package com.taskmanager.backend.service;

import com.taskmanager.backend.entity.Task;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for handling business logic related to tasks.
 * This defines operations for creating, retrieving, updating, and deleting tasks.
 */
public interface TaskService {

    /**
     * Creates a new task.
     *
     * @param task The task entity to be saved.
     * @return The saved task entity.
     */
    Task createTask(Task task);

    /**
     * Retrieves all tasks from the database.
     *
     * @return A list of all tasks.
     */
    List<Task> getAllTasks();

    /**
     * Retrieves a task by its unique ID.
     *
     * @param id The ID of the task.
     * @return An Optional containing the task if found, or empty if not found.
     */
    Optional<Task> getTaskById(Long id);

    /**
     * Updates an existing task.
     *
     * @param id The ID of the task to update.
     * @param updatedTask The updated task entity.
     * @return The updated task entity.
     */
    Task updateTask(Long id, Task updatedTask);

    /**
     * Deletes a task by its ID.
     *
     * @param id The ID of the task to delete.
     */
    void deleteTask(Long id);
}
