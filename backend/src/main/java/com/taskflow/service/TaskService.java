package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Project;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        return taskRepository.findAllByAssignedTo(user);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    public Task getTaskForUser(Long id, String userEmail) {
        Task task = getTaskById(id);
        if (task.getAssignedTo() == null || !task.getAssignedTo().getEmail().equals(userEmail)) {
            throw new ResourceNotFoundException("Task not found for the current user");
        }
        return task;
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findAllByProjectId(projectId);
    }

    public Task createTask(TaskRequest request, String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + creatorEmail));

        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        User assignee = userRepository.findById(request.getAssignedTo())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedTo()));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setProject(project);
        task.setAssignedTo(assignee);
        task.setCreatedBy(creator);
        task.setDueDate(request.getDueDate());

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, TaskRequest request) {
        Task task = getTaskById(id);

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());

        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));
            task.setProject(project);
        }

        if (request.getAssignedTo() != null) {
            User assignee = userRepository.findById(request.getAssignedTo())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedTo()));
            task.setAssignedTo(assignee);
        }

        task.setDueDate(request.getDueDate());
        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long id, String status, String userEmail) {
        Task task = getTaskForUser(id, userEmail);
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        Task task = getTaskById(id);
        taskRepository.delete(task);
    }
}
