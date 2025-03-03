package com.taskmanager.backend.controller;

import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST Controller for managing tasks.
 * Exposes endpoints for creating, retrieving, updating, and deleting tasks.
 */
@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") // Allows frontend requests from any origin
public class TaskController {

    private final TaskService taskService;

    /**
     * Constructor-based dependency injection for TaskService.
     *
     * @param taskService The service handling business logic for tasks.
     */
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * Retrieves all tasks.
     *
     * @return A ResponseEntity containing a list of tasks.
     */
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);
    }

    /**
     * Retrieves a task by its ID.
     *
     * @param id The ID of the task.
     * @return A ResponseEntity containing the task if found, or 404 if not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Creates a new task.
     *
     * @param task The task entity to be created.
     * @return A ResponseEntity containing the created task.
     */
    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task savedTask = taskService.createTask(task);
        return ResponseEntity.ok(savedTask);
    }

    /**
     * Updates an existing task by its ID.
     *
     * @param id The ID of the task to update.
     * @param updatedTask The updated task entity.
     * @return A ResponseEntity containing the updated task if successful, or 404 if not found.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        try {
            Task task = taskService.updateTask(id, updatedTask);
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Deletes a task by its ID.
     *
     * @param id The ID of the task to delete.
     * @return A ResponseEntity indicating success or failure.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
