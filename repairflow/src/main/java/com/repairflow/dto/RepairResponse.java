package com.repairflow.dto;

import com.repairflow.entity.RepairStatus;
import com.repairflow.entity.ApprovalStatus;

public class RepairResponse {

    private Long id;

    private String customerName;

    private Long technicianId;

    private String technicianName;

    private String deviceType;

    private String deviceBrand;

    private String deviceModel;

    private String problemDescription;

    private RepairStatus status;

    private ApprovalStatus diagnosisApprovalStatus;

    public RepairResponse(
            Long id,
            String customerName,
            Long technicianId,
            String technicianName,
            String deviceType,
            String deviceBrand,
            String deviceModel,
            String problemDescription,
            RepairStatus status,
            ApprovalStatus diagnosisApprovalStatus) {

        this.id = id;
        this.customerName = customerName;
        this.technicianId = technicianId;
        this.technicianName = technicianName;
        this.deviceType = deviceType;
        this.deviceBrand = deviceBrand;
        this.deviceModel = deviceModel;
        this.problemDescription = problemDescription;
        this.status = status;
        this.diagnosisApprovalStatus =
            diagnosisApprovalStatus;
    }
    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public Long getTechnicianId() {
        return technicianId;
    }

    public String getTechnicianName() {
        return technicianName;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public String getDeviceBrand() {
        return deviceBrand;
    }

    public String getDeviceModel() {
        return deviceModel;
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public RepairStatus getStatus() {
        return status;
    }

    public ApprovalStatus getDiagnosisApprovalStatus() {
    return diagnosisApprovalStatus;
}
}