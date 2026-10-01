package com.taskflow.service;

import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Project;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public UserService(UserRepository userRepository, TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("Admin accounts cannot be deleted");
        }

        List<Task> tasks = taskRepository.findAllByUserReference(user);
        tasks.forEach(task -> {
            if (task.getAssignedTo() != null && task.getAssignedTo().getId().equals(id)) {
                task.setAssignedTo(null);
            }
            if (task.getCreatedBy() != null && task.getCreatedBy().getId().equals(id)) {
                task.setCreatedBy(null);
            }
        });
        taskRepository.saveAll(tasks);

        List<Project> projects = projectRepository.findAllByCreatedBy(user);
        projects.forEach(project -> project.setCreatedBy(null));
        projectRepository.saveAll(projects);

        userRepository.delete(user);
    }
}
