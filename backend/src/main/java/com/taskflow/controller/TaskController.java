package com.taskflow.controller;

import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.model.Task;
import com.taskflow.service.TaskService;
import com.taskflow.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<TaskResponse> getTasks() {
        String currentUser = SecurityUtils.getCurrentUserEmail();
        if (currentUser == null) {
            return List.of();
        }

        List<Task> tasks = SecurityUtils.isCurrentUserAdmin()
                ? taskService.getAllTasks()
                : taskService.getTasksForUser(currentUser);

        return tasks.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public TaskResponse getTask(@PathVariable Long id) {
        String currentUser = SecurityUtils.getCurrentUserEmail();
        Task task = SecurityUtils.isCurrentUserAdmin()
                ? taskService.getTaskById(id)
                : taskService.getTaskForUser(id, currentUser);
        return toResponse(task);
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TaskResponse> getTasksByProject(@PathVariable Long projectId) {
        return taskService.getTasksByProject(projectId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public TaskResponse createTask(@RequestBody @Valid TaskRequest request) {
        return toResponse(taskService.createTask(request, SecurityUtils.getCurrentUserEmail()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public TaskResponse updateTask(@PathVariable Long id,
                           @RequestBody @Valid TaskRequest request) {
        Task task;
        if (SecurityUtils.isCurrentUserAdmin()) {
            task = taskService.updateTask(id, request);
        } else {
            task = taskService.updateTaskStatus(id, request.getStatus(), SecurityUtils.getCurrentUserEmail());
        }
        return toResponse(task);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    private TaskResponse toResponse(Task task) {
        Long projectId = task.getProject() != null ? task.getProject().getId() : null;
        String projectName = task.getProject() != null ? task.getProject().getName() : null;
        Long assignedTo = task.getAssignedTo() != null ? task.getAssignedTo().getId() : null;
        String assigneeName = task.getAssignedTo() != null ? task.getAssignedTo().getName() : null;
        Long createdBy = task.getCreatedBy() != null ? task.getCreatedBy().getId() : null;
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                projectId,
                projectName,
                assignedTo,
                assigneeName,
                createdBy,
                task.getDueDate(),
                task.getCreatedAt()
        );
    }
}
