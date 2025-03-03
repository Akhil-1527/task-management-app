package com.taskmanager.backend.service;

import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Implementation of the TaskService interface.
 * Handles business logic for task management.
 */
@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    /**
     * Constructor-based dependency injection for TaskRepository.
     *
     * @param taskRepository The repository used to interact with the database.
     */
    @Autowired
    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * Creates a new task and saves it to the database.
     *
     * @param task The task entity to be saved.
     * @return The saved task entity.
     */
    @Override
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    /**
     * Retrieves all tasks from the database.
     *
     * @return A list of all tasks.
     */
    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    /**
     * Retrieves a task by its ID.
     *
     * @param id The ID of the task.
     * @return An Optional containing the task if found, or empty if not found.
     */
    @Override
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    /**
     * Updates an existing task if it exists.
     *
     * @param id The ID of the task to update.
     * @param updatedTask The updated task entity.
     * @return The updated task entity.
     * @throws RuntimeException If the task with the given ID is not found.
     */
    @Override
    public Task updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id).map(existingTask -> {
            existingTask.setTitle(updatedTask.getTitle());
            existingTask.setDescription(updatedTask.getDescription());
            existingTask.setCompleted(updatedTask.isCompleted());
            existingTask.setDueDate(updatedTask.getDueDate());
            return taskRepository.save(existingTask);
        }).orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    /**
     * Deletes a task by its ID.
     *
     * @param id The ID of the task to delete.
     */
    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
