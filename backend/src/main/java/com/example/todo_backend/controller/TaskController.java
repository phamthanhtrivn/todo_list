package com.example.todo_backend.controller;

import com.example.todo_backend.config.SessionFilter;
import com.example.todo_backend.dto.ApiResponse;
import com.example.todo_backend.dto.TaskRequest;
import com.example.todo_backend.dto.TaskResponse;
import com.example.todo_backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "${frontend.url}", allowCredentials = "true")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TaskResponse>>> getTasks(
            @RequestAttribute(SessionFilter.SESSION_ID_ATTR) String sessionId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean completed,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<TaskResponse> tasks = taskService.getTasks(sessionId, search, completed, pageable);
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @RequestAttribute(SessionFilter.SESSION_ID_ATTR) String sessionId,
            @Valid @RequestBody TaskRequest request) {

        TaskResponse task = taskService.createTask(sessionId, request);
        return new ResponseEntity<>(ApiResponse.success(task, "Task created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @RequestAttribute(SessionFilter.SESSION_ID_ATTR) String sessionId,
            @PathVariable UUID id,
            @Valid @RequestBody TaskRequest request) {

        TaskResponse task = taskService.updateTask(sessionId, id, request);
        return ResponseEntity.ok(ApiResponse.success(task, "Task updated successfully"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(
            @RequestAttribute(SessionFilter.SESSION_ID_ATTR) String sessionId,
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> updates) {

        if (!updates.containsKey("completed")) {
            throw new IllegalArgumentException("completed field is required");
        }

        TaskResponse task = taskService.updateTaskStatus(sessionId, id, updates.get("completed"));
        return ResponseEntity.ok(ApiResponse.success(task, "Task status updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @RequestAttribute(SessionFilter.SESSION_ID_ATTR) String sessionId,
            @PathVariable UUID id) {

        taskService.deleteTask(sessionId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Task deleted successfully"));
    }
}
