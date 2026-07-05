package com.example.todo_backend.repository;

import com.example.todo_backend.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    Page<Task> findByUserId(String userId, Pageable pageable);
    
    Page<Task> findByUserIdAndCompleted(String userId, boolean completed, Pageable pageable);
    
    Page<Task> findByUserIdAndTitleContainingIgnoreCase(String userId, String title, Pageable pageable);
    
    Page<Task> findByUserIdAndTitleContainingIgnoreCaseAndCompleted(String userId, String title, boolean completed, Pageable pageable);
    
    Optional<Task> findByIdAndUserId(UUID id, String userId);
}
