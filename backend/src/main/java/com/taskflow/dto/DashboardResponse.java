package com.taskflow.dto;

import java.util.Map;

public class DashboardResponse {

    private long totalProjects;
    private long totalTasks;
    private long totalUsers;
    private Map<String, Long> tasksByStatus;

    public DashboardResponse() {
    }

    public DashboardResponse(long totalProjects, long totalTasks, long totalUsers, Map<String, Long> tasksByStatus) {
        this.totalProjects = totalProjects;
        this.totalTasks = totalTasks;
        this.totalUsers = totalUsers;
        this.tasksByStatus = tasksByStatus;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Map<String, Long> getTasksByStatus() {
        return tasksByStatus;
    }

    public void setTasksByStatus(Map<String, Long> tasksByStatus) {
        this.tasksByStatus = tasksByStatus;
    }
}
