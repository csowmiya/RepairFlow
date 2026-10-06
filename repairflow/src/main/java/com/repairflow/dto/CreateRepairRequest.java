package com.repairflow.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateRepairRequest {

    @NotBlank(message = "Device type is required")
    private String deviceType;

    @NotBlank(message = "Device brand is required")
    private String deviceBrand;

    @NotBlank(message = "Device model is required")
    private String deviceModel;

    @NotBlank(message = "Problem description is required")
    private String problemDescription;

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public String getDeviceBrand() {
        return deviceBrand;
    }

    public void setDeviceBrand(String deviceBrand) {
        this.deviceBrand = deviceBrand;
    }

    public String getDeviceModel() {
        return deviceModel;
    }

    public void setDeviceModel(String deviceModel) {
        this.deviceModel = deviceModel;
    }

    public String getProblemDescription() {
        return problemDescription;
    }

    public void setProblemDescription(String problemDescription) {
        this.problemDescription = problemDescription;
    }
}