package com.taskflow.repository;

import com.taskflow.model.Task;
import com.taskflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findAllByAssignedTo(User user);
    List<Task> findAllByProjectId(Long projectId);
}
