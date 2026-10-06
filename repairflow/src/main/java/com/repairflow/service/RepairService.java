package com.repairflow.service;

import com.repairflow.dto.CustomerRepairHistoryResponse;
import com.repairflow.dto.CreateRepairRequest;
import com.repairflow.dto.RepairHistoryResponse;
import com.repairflow.dto.RepairResponse;
import com.repairflow.dto.UpdateRepairStatusRequest;
import com.repairflow.entity.ApprovalStatus;
import com.repairflow.entity.Diagnosis;
import com.repairflow.entity.Repair;
import com.repairflow.entity.RepairHistory;
import com.repairflow.entity.RepairStatus;
import com.repairflow.entity.Role;
import com.repairflow.entity.User;
import com.repairflow.exception.InvalidStatusTransitionException;
import com.repairflow.exception.InvalidTechnicianException;
import com.repairflow.exception.RepairAccessDeniedException;
import com.repairflow.exception.RepairNotFoundException;
import com.repairflow.exception.TechnicianNotFoundException;
import com.repairflow.repository.DiagnosisRepository;
import com.repairflow.repository.RepairHistoryRepository;
import com.repairflow.repository.RepairRepository;
import com.repairflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RepairService {

    private final RepairRepository repairRepository;
    private final UserRepository userRepository;
    private final RepairHistoryRepository repairHistoryRepository;
    private final DiagnosisRepository diagnosisRepository;

    public RepairService(
            RepairRepository repairRepository,
            UserRepository userRepository,
            RepairHistoryRepository repairHistoryRepository,
            DiagnosisRepository diagnosisRepository) {

        this.repairRepository = repairRepository;
        this.userRepository = userRepository;
        this.repairHistoryRepository = repairHistoryRepository;
        this.diagnosisRepository = diagnosisRepository;
    }


    // =========================================================
    // CREATE REPAIR
    // =========================================================

    public RepairResponse createRepair(
            CreateRepairRequest request,
            String customerEmail) {

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() ->
                        new RepairAccessDeniedException(
                                "Customer account not found"
                        )
                );

        Repair repair = new Repair();

        repair.setCustomer(customer);

        repair.setDeviceType(
                request.getDeviceType()
        );

        repair.setDeviceBrand(
                request.getDeviceBrand()
        );

        repair.setDeviceModel(
                request.getDeviceModel()
        );

        repair.setProblemDescription(
                request.getProblemDescription()
        );

        repair.setStatus(
                RepairStatus.PENDING
        );

        Repair savedRepair =
                repairRepository.save(repair);

        return toRepairResponse(savedRepair);
    }


    // =========================================================
    // ASSIGN TECHNICIAN
    // =========================================================

    @Transactional
    public RepairResponse assignTechnician(
            Long repairId,
            Long technicianId,
            String adminEmail) {

        Repair repair = repairRepository.findById(repairId)
                .orElseThrow(() ->
                        new RepairNotFoundException(
                                "Repair not found with id: "
                                        + repairId
                        )
                );

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() ->
                        new TechnicianNotFoundException(
                                "Technician not found with id: "
                                        + technicianId
                        )
                );

        if (technician.getRole() != Role.TECHNICIAN) {

            throw new InvalidTechnicianException(
                    "Selected user is not a technician"
            );
        }


        RepairStatus oldStatus =
                repair.getStatus();

        if (repair.getStatus() != RepairStatus.PENDING) {

    throw new InvalidStatusTransitionException(
            "Only pending repairs can be assigned to a technician"
    );
}

        repair.setTechnician(technician);

        repair.setStatus(
                RepairStatus.ASSIGNED
        );

        Repair updatedRepair =
                repairRepository.save(repair);

        saveHistory(
                updatedRepair,
                adminEmail,
                oldStatus,
                RepairStatus.ASSIGNED
        );

        return toRepairResponse(updatedRepair);
    }


    // =========================================================
    // GET REPAIRS
    // =========================================================

    public List<RepairResponse> getRepairs(
            String email,
            Role role) {

        List<Repair> repairs;

        if (role == Role.ADMIN) {

            repairs = repairRepository.findAll();

        } else if (role == Role.TECHNICIAN) {

            repairs =
                    repairRepository.findByTechnicianEmail(email);

        } else if (role == Role.CUSTOMER) {

            repairs =
                    repairRepository.findByCustomerEmail(email);

        } else {

            throw new RepairAccessDeniedException(
                    "You are not allowed to view repairs"
            );
        }

        return repairs.stream()
                .map(this::toRepairResponse)
                .toList();
    }


    // =========================================================
    // GET REPAIR BY ID
    // =========================================================

    public RepairResponse getRepairById(
            Long repairId,
            String email,
            Role role) {

        Repair repair =
                repairRepository.findById(repairId)
                        .orElseThrow(() ->
                                new RepairNotFoundException(
                                        "Repair not found with id: "
                                                + repairId
                                )
                        );

        checkRepairAccess(
                repair,
                email,
                role
        );

        return toRepairResponse(repair);
    }


    // =========================================================
    // UPDATE REPAIR STATUS
    // =========================================================

    @Transactional
    public RepairResponse updateRepairStatus(
            Long repairId,
            UpdateRepairStatusRequest request,
            String email,
            Role role) {

        Repair repair =
                repairRepository.findById(repairId)
                        .orElseThrow(() ->
                                new RepairNotFoundException(
                                        "Repair not found with id: "
                                                + repairId
                                )
                        );

        RepairStatus currentStatus =
                repair.getStatus();

        RepairStatus newStatus =
                request.getStatus();


        // -----------------------------------------------------
        // ADMIN
        // -----------------------------------------------------

        if (role == Role.ADMIN) {

            validateStatusTransition(
                    currentStatus,
                    newStatus
            );
        }


        // -----------------------------------------------------
        // TECHNICIAN
        // -----------------------------------------------------

        else if (role == Role.TECHNICIAN) {

            // Technician must be assigned to this repair
            if (repair.getTechnician() == null ||
                    !repair.getTechnician()
                            .getEmail()
                            .equals(email)) {

                throw new RepairAccessDeniedException(
                        "You are not assigned to this repair"
                );
            }


            // ASSIGNED → IN_PROGRESS
            if (currentStatus == RepairStatus.ASSIGNED &&
                    newStatus == RepairStatus.IN_PROGRESS) {

                // allowed
            }


            // IN_PROGRESS → AWAITING_APPROVAL
            else if (currentStatus == RepairStatus.IN_PROGRESS &&
                    newStatus == RepairStatus.AWAITING_APPROVAL) {

                // allowed
            }


            // IN_PROGRESS → READY_FOR_PICKUP
            //
            // This is only allowed AFTER the customer
            // has approved the diagnosis.
             else if (currentStatus == RepairStatus.IN_PROGRESS &&
        newStatus == RepairStatus.READY_FOR_PICKUP) {

    throw new InvalidStatusTransitionException(
            "Use the complete repair operation to mark the repair ready for pickup"
    );
}


            // READY_FOR_PICKUP → COMPLETED
            else if (currentStatus == RepairStatus.READY_FOR_PICKUP &&
                    newStatus == RepairStatus.COMPLETED) {

                // allowed
            }


            else {

                throw new InvalidStatusTransitionException(
                        "Technician cannot change status from "
                                + currentStatus
                                + " to "
                                + newStatus
                );
            }
        }


        // -----------------------------------------------------
        // CUSTOMER
        // -----------------------------------------------------

        else if (role == Role.CUSTOMER) {

            if (!repair.getCustomer()
                    .getEmail()
                    .equals(email)) {

                throw new RepairAccessDeniedException(
                        "You are not allowed to update this repair"
                );
            }


            // Customer can only cancel a PENDING repair
            if (currentStatus == RepairStatus.PENDING &&
                    newStatus == RepairStatus.CANCELLED) {

                // allowed
            }

            else {

                throw new InvalidStatusTransitionException(
                        "Customer cannot change status from "
                                + currentStatus
                                + " to "
                                + newStatus
                );
            }
        }


        // -----------------------------------------------------
        // UNKNOWN ROLE
        // -----------------------------------------------------

        else {

            throw new RepairAccessDeniedException(
                    "You are not allowed to update repair status"
            );
        }


        // -----------------------------------------------------
        // SAVE STATUS CHANGE
        // -----------------------------------------------------

        repair.setStatus(newStatus);

        Repair updatedRepair =
                repairRepository.save(repair);

        saveHistory(
                updatedRepair,
                email,
                currentStatus,
                newStatus
        );

        return toRepairResponse(updatedRepair);
    }


   

    // =========================================================
    // DELETE REPAIR
    // =========================================================

    public void deleteRepair(
            Long repairId,
            String email,
            Role role) {

        Repair repair =
                repairRepository.findById(repairId)
                        .orElseThrow(() ->
                                new RepairNotFoundException(
                                        "Repair not found with id: "
                                                + repairId
                                )
                        );


        if (role == Role.ADMIN) {

            repairRepository.delete(repair);

            return;
        }


        if (role == Role.CUSTOMER) {

    if (!repair.getCustomer()
            .getEmail()
            .equals(email)) {

        throw new RepairAccessDeniedException(
                "You are not allowed to delete this repair"
        );
    }

    if (repair.getStatus() != RepairStatus.PENDING) {

        throw new InvalidStatusTransitionException(
                "Only pending repairs can be deleted"
        );
    }

    repairRepository.delete(repair);

    return;
}


        throw new RepairAccessDeniedException(
                "You are not allowed to delete this repair"
        );
    }


    // =========================================================
    // VALIDATE STATUS TRANSITION
    // =========================================================

    private void validateStatusTransition(
            RepairStatus currentStatus,
            RepairStatus newStatus) {

        // PENDING → ASSIGNED
        if (currentStatus == RepairStatus.PENDING &&
                newStatus == RepairStatus.ASSIGNED) {

            return;
        }


        // PENDING → CANCELLED
        if (currentStatus == RepairStatus.PENDING &&
                newStatus == RepairStatus.CANCELLED) {

            return;
        }


        // ASSIGNED → IN_PROGRESS
        if (currentStatus == RepairStatus.ASSIGNED &&
                newStatus == RepairStatus.IN_PROGRESS) {

            return;
        }


        // ASSIGNED → CANCELLED
        if (currentStatus == RepairStatus.ASSIGNED &&
                newStatus == RepairStatus.CANCELLED) {

            return;
        }


        // IN_PROGRESS → AWAITING_APPROVAL
        if (currentStatus == RepairStatus.IN_PROGRESS &&
                newStatus == RepairStatus.AWAITING_APPROVAL) {

            return;
        }


        // AWAITING_APPROVAL → IN_PROGRESS
        if (currentStatus == RepairStatus.AWAITING_APPROVAL &&
                newStatus == RepairStatus.IN_PROGRESS) {

            return;
        }


        // AWAITING_APPROVAL → CANCELLED
        if (currentStatus == RepairStatus.AWAITING_APPROVAL &&
                newStatus == RepairStatus.CANCELLED) {

            return;
        }


        // IN_PROGRESS → READY_FOR_PICKUP
//
// This transition must happen only through
// DiagnosisService.completeRepair().
// That operation verifies customer approval,
// records actual work, and records final cost.

if (currentStatus == RepairStatus.IN_PROGRESS &&
        newStatus == RepairStatus.READY_FOR_PICKUP) {

    throw new InvalidStatusTransitionException(
            "Use the complete repair operation to mark the repair ready for pickup"
    );
}


        // READY_FOR_PICKUP → COMPLETED
        if (currentStatus == RepairStatus.READY_FOR_PICKUP &&
                newStatus == RepairStatus.COMPLETED) {

            return;
        }


        throw new InvalidStatusTransitionException(
                "Cannot change status from "
                        + currentStatus
                        + " to "
                        + newStatus
        );
    }


    // =========================================================
    // SAVE HISTORY
    // =========================================================

    @Transactional
    public void changeStatusWithHistory(
            Repair repair,
            RepairStatus newStatus,
            String changedBy) {

        RepairStatus oldStatus =
                repair.getStatus();

        repair.setStatus(newStatus);

        repairRepository.save(repair);

        saveHistory(
                repair,
                changedBy,
                oldStatus,
                newStatus
        );
    }


private void saveHistory(
        Repair repair,
        String changedBy,
        RepairStatus oldStatus,
        RepairStatus newStatus) {

    RepairHistory history = new RepairHistory();

    history.setRepair(repair);
    history.setChangedBy(changedBy);
    User changedByUser = userRepository.findByEmail(changedBy)
        .orElseThrow(() -> new RuntimeException("User not found"));

    history.setChangedByRole(changedByUser.getRole());

    history.setDescription(
            getHistoryDescription(oldStatus, newStatus)
    );

    history.setOldStatus(oldStatus);
    history.setNewStatus(newStatus);

    history.setChangedAt(
            LocalDateTime.now()
    );

    repairHistoryRepository.save(history);
}


private String getHistoryDescription(
        RepairStatus oldStatus,
        RepairStatus newStatus) {

    if (oldStatus == RepairStatus.PENDING &&
            newStatus == RepairStatus.ASSIGNED) {

        return "Technician assigned to the repair";
    }

    if (oldStatus == RepairStatus.ASSIGNED &&
            newStatus == RepairStatus.IN_PROGRESS) {

        return "Technician started working on the repair";
    }

    if (oldStatus == RepairStatus.IN_PROGRESS &&
            newStatus == RepairStatus.AWAITING_APPROVAL) {

        return "Diagnosis created and sent for customer approval";
    }

    if (oldStatus == RepairStatus.AWAITING_APPROVAL &&
            newStatus == RepairStatus.IN_PROGRESS) {

        return "Diagnosis approved by customer";
    }

    if (oldStatus == RepairStatus.AWAITING_APPROVAL &&
            newStatus == RepairStatus.CANCELLED) {

        return "Diagnosis rejected by customer";
    }

    if (oldStatus == RepairStatus.PENDING &&
            newStatus == RepairStatus.CANCELLED) {

        return "Repair cancelled by customer";
    }

    if (oldStatus == RepairStatus.ASSIGNED &&
            newStatus == RepairStatus.CANCELLED) {

        return "Repair cancelled";
    }

    if (oldStatus == RepairStatus.IN_PROGRESS &&
            newStatus == RepairStatus.READY_FOR_PICKUP) {

        return "Repair completed and ready for pickup";
    }

    if (oldStatus == RepairStatus.READY_FOR_PICKUP &&
            newStatus == RepairStatus.COMPLETED) {

        return "Repair completed";
    }

    return "Repair status updated";
}

    // =========================================================
    // GET REPAIR HISTORY
    // =========================================================

    @Transactional(readOnly = true)
    public List<?> getRepairHistory(
        Long repairId,
        String email,
        Role role) {

        Repair repair =
                repairRepository.findById(repairId)
                        .orElseThrow(() ->
                                new RepairNotFoundException(
                                        "Repair not found with id: "
                                                + repairId
                                )
                        );


        checkRepairAccess(
                repair,
                email,
                role
        );

if (role == Role.ADMIN) {
        return repairHistoryRepository
                .findByRepairIdOrderByChangedAtAsc(repairId)
                .stream()
                .map(history ->
                        new RepairHistoryResponse(
        history.getId(),
        history.getChangedBy(),
        history.getChangedByRole(),
        history.getDescription(),
        history.getOldStatus(),
        history.getNewStatus(),
        history.getChangedAt()
        )
                )
                .toList();
    }
    return repairHistoryRepository
        .findByRepairIdOrderByChangedAtAsc(repairId)
        .stream()
        .map(history ->
                new CustomerRepairHistoryResponse(
                        history.getId(),
                        history.getDescription(),
                        history.getOldStatus(),
                        history.getNewStatus(),
                        history.getChangedAt()
                )
        )
        .toList();
}


    // =========================================================
    // CHECK REPAIR ACCESS
    // =========================================================

    private void checkRepairAccess(
            Repair repair,
            String email,
            Role role) {

        if (role == Role.ADMIN) {

            return;
        }


        if (role == Role.CUSTOMER) {

            if (!repair.getCustomer()
                    .getEmail()
                    .equals(email)) {

                throw new RepairAccessDeniedException(
                        "You are not allowed to view this repair"
                );
            }

            return;
        }


        if (role == Role.TECHNICIAN) {

            if (repair.getTechnician() == null ||
                    !repair.getTechnician()
                            .getEmail()
                            .equals(email)) {

                throw new RepairAccessDeniedException(
                        "You are not assigned to this repair"
                );
            }

            return;
        }


        throw new RepairAccessDeniedException(
                "You are not allowed to access this repair"
        );
    }


    // =========================================================
    // CONVERT REPAIR → RESPONSE
    // =========================================================

    private RepairResponse toRepairResponse(
            Repair repair) {

        Long technicianId = null;
        String technicianName = null;

        if (repair.getTechnician() != null) {

            technicianId =
                    repair.getTechnician().getId();

            technicianName =
                    repair.getTechnician().getName();
        }

        ApprovalStatus diagnosisApprovalStatus =
        diagnosisRepository
                .findByRepairId(repair.getId())
                .map(Diagnosis::getApprovalStatus)
                .orElse(null);


       return new RepairResponse(
        repair.getId(),
        repair.getCustomer().getName(),
        technicianId,
        technicianName,
        repair.getDeviceType(),
        repair.getDeviceBrand(),
        repair.getDeviceModel(),
        repair.getProblemDescription(),
        repair.getStatus(),
        diagnosisApprovalStatus
);
    }
}