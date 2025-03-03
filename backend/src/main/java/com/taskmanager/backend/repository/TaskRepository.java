package com.taskmanager.backend.repository;

import com.taskmanager.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for managing Task entities in the database.
 * This interface extends JpaRepository, providing built-in CRUD operations.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Finds all tasks based on their completion status.
     *
     * @param completed Boolean flag indicating whether to retrieve completed tasks or not.
     * @return A list of tasks matching the specified completion status.
     */
    List<Task> findByCompleted(boolean completed);
}
