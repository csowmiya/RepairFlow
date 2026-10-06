package com.repairflow.service;

import com.repairflow.dto.CompleteRepairRequest;
import com.repairflow.dto.DiagnosisApprovalRequest;
import com.repairflow.dto.DiagnosisRequest;
import com.repairflow.dto.DiagnosisResponse;
import com.repairflow.entity.ApprovalStatus;
import com.repairflow.entity.Diagnosis;
import com.repairflow.entity.Repair;
import com.repairflow.entity.RepairStatus;
import com.repairflow.entity.Role;
import com.repairflow.entity.User;
import com.repairflow.exception.InvalidStatusTransitionException;
import com.repairflow.exception.RepairAccessDeniedException;
import com.repairflow.exception.RepairNotFoundException;
import com.repairflow.repository.DiagnosisRepository;
import com.repairflow.repository.RepairRepository;
import com.repairflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.repairflow.exception.DiagnosisAlreadyExistsException;
import java.time.LocalDateTime;

@Service
public class DiagnosisService {

    private final DiagnosisRepository diagnosisRepository;
    private final RepairRepository repairRepository;
    private final UserRepository userRepository;
    private final RepairService repairService;

    public DiagnosisService(
            DiagnosisRepository diagnosisRepository,
            RepairRepository repairRepository,
            UserRepository userRepository,
            RepairService repairService) {

        this.diagnosisRepository = diagnosisRepository;
        this.repairRepository = repairRepository;
        this.userRepository = userRepository;
        this.repairService = repairService;
    }

    /*
     * ============================================================
     * CREATE DIAGNOSIS
     * ============================================================
     */

    @Transactional
    public DiagnosisResponse createDiagnosis(
            Long repairId,
            DiagnosisRequest request,
            String technicianEmail) {

        Repair repair = findRepair(repairId);

        User technician = findUser(technicianEmail);

        validateTechnician(technician);

        validateAssignedTechnician(
                repair,
                technician
        );

        if (repair.getStatus() != RepairStatus.IN_PROGRESS) {
            throw new InvalidStatusTransitionException(
                    "Diagnosis can only be created when the repair is in progress"
            );
        }

        if (diagnosisRepository.findByRepairId(repairId).isPresent()) {
            throw new DiagnosisAlreadyExistsException(
                    "Diagnosis already exists for this repair"
            );
        }

        Diagnosis diagnosis = new Diagnosis();

        diagnosis.setRepair(repair);
        diagnosis.setTechnician(technician);

        diagnosis.setDiagnosis(
                request.getDiagnosis()
        );

        diagnosis.setRecommendedAction(
                request.getRecommendedAction()
        );

        diagnosis.setEstimatedCost(
                request.getEstimatedCost()
        );

        /*
         * These fields are intentionally empty at diagnosis stage.
         */
        diagnosis.setActualAction(null);
        diagnosis.setFinalCost(null);

        diagnosis.setApprovalStatus(
                ApprovalStatus.PENDING
        );

        diagnosis.setDiagnosedAt(
                LocalDateTime.now()
        );

        Diagnosis savedDiagnosis =
                diagnosisRepository.save(diagnosis);

        /*
         * Diagnosis is now waiting for customer approval.
         */
        repairService.changeStatusWithHistory(
                repair,
                RepairStatus.AWAITING_APPROVAL,
                technicianEmail
        );

        return toResponse(savedDiagnosis);
    }

    /*
     * ============================================================
     * GET DIAGNOSIS
     * ============================================================
     */

    @Transactional(readOnly = true)
    public DiagnosisResponse getDiagnosis(
            Long repairId,
            String email,
            Role role) {

        Repair repair = findRepair(repairId);

        checkRepairAccess(
                repair,
                email,
                role
        );

        Diagnosis diagnosis =
                diagnosisRepository.findByRepairId(repairId)
                        .orElseThrow(() ->
                                new RepairNotFoundException(
                                        "Diagnosis not found for repair: "
                                                + repairId
                                )
                        );

        return toResponse(diagnosis);
    }

    /*
     * ============================================================
     * CUSTOMER APPROVAL
     * ============================================================
     */

    @Transactional
    public DiagnosisResponse approveDiagnosis(
            Long repairId,
            DiagnosisApprovalRequest request,
            String customerEmail) {

        Repair repair = findRepair(repairId);

        User customer = findUser(customerEmail);

        if (customer.getRole() != Role.CUSTOMER) {
            throw new RepairAccessDeniedException(
                    "Only customers can approve or reject a diagnosis"
            );
        }

        if (repair.getCustomer() == null ||
                !repair.getCustomer()
                        .getId()
                        .equals(customer.getId())) {

            throw new RepairAccessDeniedException(
                    "You are not allowed to approve this diagnosis"
            );
        }

        Diagnosis diagnosis =
                diagnosisRepository.findByRepairId(repairId)
                        .orElseThrow(() ->
                                new RepairNotFoundException(
                                        "Diagnosis not found for repair: "
                                                + repairId
                                )
                        );

        if (repair.getStatus() != RepairStatus.AWAITING_APPROVAL) {
            throw new InvalidStatusTransitionException(
                    "Repair is not awaiting customer approval"
            );
        }

        if (diagnosis.getApprovalStatus() != ApprovalStatus.PENDING) {
            throw new RepairAccessDeniedException(
                    "Diagnosis has already been approved or rejected"
            );
        }

        if (request.getApprovalStatus() == ApprovalStatus.APPROVED) {

            diagnosis.setApprovalStatus(
                    ApprovalStatus.APPROVED
            );

            diagnosisRepository.save(diagnosis);

            repairService.changeStatusWithHistory(
                    repair,
                    RepairStatus.IN_PROGRESS,
                    customerEmail
            );

        } else if (request.getApprovalStatus()
                == ApprovalStatus.REJECTED) {

            diagnosis.setApprovalStatus(
                    ApprovalStatus.REJECTED
            );

            diagnosisRepository.save(diagnosis);

            repairService.changeStatusWithHistory(
                    repair,
                    RepairStatus.CANCELLED,
                    customerEmail
            );

        } else {

            throw new InvalidStatusTransitionException(
                    "Approval status must be APPROVED or REJECTED"
            );
        }

        return toResponse(diagnosis);
    }

    /*
     * ============================================================
     * COMPLETE REPAIR
     * ============================================================
     */

    @Transactional
    public DiagnosisResponse completeRepair(
            Long repairId,
            CompleteRepairRequest request,
            String technicianEmail) {

        Repair repair = findRepair(repairId);

        User technician = findUser(technicianEmail);

        validateTechnician(technician);

        validateAssignedTechnician(
                repair,
                technician
        );

        if (repair.getStatus() != RepairStatus.IN_PROGRESS) {
            throw new InvalidStatusTransitionException(
                    "Repair can only be completed while it is in progress"
            );
        }

        Diagnosis diagnosis =
                diagnosisRepository.findByRepairId(repairId)
                        .orElseThrow(() ->
                                new RepairNotFoundException(
                                        "Diagnosis not found for repair: "
                                                + repairId
                                )
                        );

        if (diagnosis.getApprovalStatus()
                != ApprovalStatus.APPROVED) {

            throw new InvalidStatusTransitionException(
                    "Repair cannot be completed until the customer approves the diagnosis"
            );
        }

        diagnosis.setActualAction(
                request.getActualAction()
        );

        diagnosis.setFinalCost(
                request.getFinalCost()
        );

        Diagnosis updatedDiagnosis =
                diagnosisRepository.save(diagnosis);

        /*
         * Only after actual work and final cost are recorded
         * can the repair become ready for pickup.
         */
        repairService.changeStatusWithHistory(
                repair,
                RepairStatus.READY_FOR_PICKUP,
                technicianEmail
        );

        return toResponse(updatedDiagnosis);
    }

    /*
     * ============================================================
     * HELPER METHODS
     * ============================================================
     */

    private Repair findRepair(Long repairId) {

        return repairRepository.findById(repairId)
                .orElseThrow(() ->
                        new RepairNotFoundException(
                                "Repair not found for id: "
                                        + repairId
                        )
                );
    }

    private User findUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RepairAccessDeniedException(
                                "User account not found"
                        )
                );
    }

    private void validateTechnician(User technician) {

        if (technician.getRole() != Role.TECHNICIAN) {

            throw new RepairAccessDeniedException(
                    "Only technicians can perform this action"
            );
        }
    }

    private void validateAssignedTechnician(
            Repair repair,
            User technician) {

        if (repair.getTechnician() == null ||
                !repair.getTechnician()
                        .getId()
                        .equals(technician.getId())) {

            throw new RepairAccessDeniedException(
                    "You are not assigned to this repair"
            );
        }
    }

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

    private DiagnosisResponse toResponse(
            Diagnosis diagnosis) {

        return new DiagnosisResponse(
                diagnosis.getId(),
                diagnosis.getRepair().getId(),
                diagnosis.getTechnician().getName(),
                diagnosis.getTechnician().getEmail(),
                diagnosis.getDiagnosis(),
                diagnosis.getRecommendedAction(),
                diagnosis.getActualAction(),
                diagnosis.getEstimatedCost(),
                diagnosis.getFinalCost(),
                diagnosis.getApprovalStatus(),
                diagnosis.getDiagnosedAt()
        );
    }
}