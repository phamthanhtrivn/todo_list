package com.example.todo_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TaskRequest {
    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;
    
    private String description;
    
    private Boolean completed;
}
