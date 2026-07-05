package com.example.todo_backend.service;

import com.example.todo_backend.dto.TaskRequest;
import com.example.todo_backend.dto.TaskResponse;
import com.example.todo_backend.entity.Task;
import com.example.todo_backend.exception.ResourceNotFoundException;
import com.example.todo_backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    private String hashUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("Session ID is required");
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(userId.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not found", e);
        }
    }

    private static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public Page<TaskResponse> getTasks(String rawUserId, String search, Boolean completed, Pageable pageable) {
        String hashedUserId = hashUserId(rawUserId);
        Page<Task> tasks;
        
        if (search != null && !search.trim().isEmpty()) {
            if (completed != null) {
                tasks = taskRepository.findByUserIdAndTitleContainingIgnoreCaseAndCompleted(hashedUserId, search, completed, pageable);
            } else {
                tasks = taskRepository.findByUserIdAndTitleContainingIgnoreCase(hashedUserId, search, pageable);
            }
        } else {
            if (completed != null) {
                tasks = taskRepository.findByUserIdAndCompleted(hashedUserId, completed, pageable);
            } else {
                tasks = taskRepository.findByUserId(hashedUserId, pageable);
            }
        }
        
        return tasks.map(TaskResponse::fromEntity);
    }

    public TaskResponse createTask(String rawUserId, TaskRequest request) {
        String hashedUserId = hashUserId(rawUserId);
        Task task = Task.builder()
                .userId(hashedUserId)
                .title(request.getTitle())
                .description(request.getDescription())
                .completed(request.getCompleted() != null ? request.getCompleted() : false)
                .build();
        return TaskResponse.fromEntity(taskRepository.save(task));
    }

    public TaskResponse updateTask(String rawUserId, UUID id, TaskRequest request) {
        String hashedUserId = hashUserId(rawUserId);
        Task task = taskRepository.findByIdAndUserId(id, hashedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
                
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getCompleted() != null) {
            task.setCompleted(request.getCompleted());
        }
        
        return TaskResponse.fromEntity(taskRepository.save(task));
    }

    public TaskResponse updateTaskStatus(String rawUserId, UUID id, boolean completed) {
        String hashedUserId = hashUserId(rawUserId);
        Task task = taskRepository.findByIdAndUserId(id, hashedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
                
        task.setCompleted(completed);
        return TaskResponse.fromEntity(taskRepository.save(task));
    }

    public void deleteTask(String rawUserId, UUID id) {
        String hashedUserId = hashUserId(rawUserId);
        Task task = taskRepository.findByIdAndUserId(id, hashedUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        taskRepository.delete(task);
    }
}
