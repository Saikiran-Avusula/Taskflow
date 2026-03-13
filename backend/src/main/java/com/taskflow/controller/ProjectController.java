package com.taskflow.controller;

import com.taskflow.dto.ProjectRequest;
import com.taskflow.dto.ProjectResponse;
import com.taskflow.model.Project;
import com.taskflow.service.ProjectService;
import com.taskflow.util.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public List<ProjectResponse> getAllProjects() {
        return projectService.getAllProjects().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ProjectResponse getProjectById(@PathVariable Long id) {
        return toResponse(projectService.getProjectById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectResponse createProject(@RequestBody @Valid ProjectRequest request) {
        return toResponse(projectService.createProject(request, SecurityUtils.getCurrentUserEmail()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectResponse updateProject(@PathVariable Long id,
                                         @RequestBody @Valid ProjectRequest request) {
        return toResponse(projectService.updateProject(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    private ProjectResponse toResponse(Project project) {
        Long createdById = project.getCreatedBy() != null ? project.getCreatedBy().getId() : null;
        String createdByName = project.getCreatedBy() != null ? project.getCreatedBy().getName() : null;
        return new ProjectResponse(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus(),
                createdById,
                createdByName,
                project.getCreatedAt()
        );
    }
}
