package com.taskflow.controller;

import com.taskflow.dto.DashboardResponse;
import com.taskflow.service.DashboardService;
import com.taskflow.util.SecurityUtils;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardResponse adminDashboard() {
        return dashboardService.getAdminDashboard();
    }

    @GetMapping("/user")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public DashboardResponse userDashboard() {
        return dashboardService.getUserDashboard(SecurityUtils.getCurrentUserEmail());
    }
}
