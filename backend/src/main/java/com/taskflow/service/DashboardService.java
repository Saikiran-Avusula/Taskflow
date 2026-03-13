package com.taskflow.service;

import com.taskflow.dto.DashboardResponse;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public DashboardService(ProjectRepository projectRepository,
                            TaskRepository taskRepository,
                            UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getAdminDashboard() {
        long totalProjects = projectRepository.count();
        long totalTasks = taskRepository.count();
        long totalUsers = userRepository.count();
        Map<String, Long> tasksByStatus = taskRepository.findAll().stream()
                .collect(Collectors.groupingBy(Task::getStatus, Collectors.counting()));

        return new DashboardResponse(totalProjects, totalTasks, totalUsers, tasksByStatus);
    }

    public DashboardResponse getUserDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        List<Task> userTasks = taskRepository.findAllByAssignedTo(user);

        Map<String, Long> tasksByStatus = userTasks.stream()
                .collect(Collectors.groupingBy(Task::getStatus, Collectors.counting()));

        long totalTasks = userTasks.size();
        long totalProjects = userTasks.stream()
                .map(Task::getProject)
                .filter(p -> p != null)
                .map(p -> p.getId())
                .distinct()
                .count();

        return new DashboardResponse(totalProjects, totalTasks, 0, tasksByStatus);
    }
}
