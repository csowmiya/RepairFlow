import StatusBadge from "../StatusBadge";


function TechnicianRepairCard({
    repair,
    handleStatusUpdate,
    handleDiagnosisClick,
    setShowDiagnosisForm,
    setShowCompletionForm
}) {

    const isAssigned =
        repair.status === "ASSIGNED";

    const isInProgress =
        repair.status === "IN_PROGRESS";

    const isAwaitingApproval =
        repair.status === "AWAITING_APPROVAL";

    const isReadyForPickup =
        repair.status === "READY_FOR_PICKUP";

    const isCompleted =
        repair.status === "COMPLETED";

    const isCancelled =
        repair.status === "CANCELLED";


    const hasNoDiagnosis =
        repair.diagnosisApprovalStatus === null ||
        repair.diagnosisApprovalStatus === undefined;

    const diagnosisPending =
        repair.diagnosisApprovalStatus === "PENDING";

    const diagnosisApproved =
        repair.diagnosisApprovalStatus === "APPROVED";


    const deviceName =
        [repair.deviceBrand, repair.deviceModel]
            .filter(Boolean)
            .join(" ") ||
        "Device";


    return (
        <div className="technician-repair-card">

            {/* =================================================
                CARD HEADER
            ================================================= */}

            <div className="repair-card-header">

                <div>

                    <h3>
                        Repair #{repair.id}
                    </h3>

                    <p className="repair-device">
                        {deviceName}
                    </p>

                </div>


                <StatusBadge
                    status={repair.status}
                />

            </div>


            {/* =================================================
                REPAIR DETAILS
            ================================================= */}

            <div className="repair-card-details">

                <div className="repair-detail">

                    <span className="detail-label">
                        Customer
                    </span>

                    <span className="detail-value">
                        {repair.customerName ||
                            "Customer unavailable"}
                    </span>

                </div>


                <div className="repair-detail">

                    <span className="detail-label">
                        Device Type
                    </span>

                    <span className="detail-value">
                        {repair.deviceType}
                    </span>

                </div>


                <div className="repair-detail repair-detail-wide">

                    <span className="detail-label">
                        Problem
                    </span>

                    <span className="detail-value">
                        {repair.problemDescription}
                    </span>

                </div>


                <div className="repair-detail">

                    <span className="detail-label">
                        Diagnosis Approval
                    </span>

                    <span className="detail-value">

                        {repair.diagnosisApprovalStatus ||
                            "Not available"}

                    </span>

                </div>

            </div>


            {/* =================================================
                WORKFLOW ACTIONS
            ================================================= */}

            <div className="technician-card-actions">

                {/* =================================================
                    ASSIGNED
                ================================================= */}

                {isAssigned && (

                    <button
                        className="primary-button"
                        type="button"
                        onClick={() =>
                            handleStatusUpdate(
                                repair.id,
                                "IN_PROGRESS"
                            )
                        }
                    >
                        Start Repair
                    </button>

                )}


                {/* =================================================
                    IN PROGRESS
                ================================================= */}

                {isInProgress && (

                    <div className="workflow-actions">

                        {/* Create Diagnosis */}

                        {hasNoDiagnosis && (

                            <button
                                className="primary-button"
                                type="button"
                                onClick={() => {

                                    setShowDiagnosisForm(
                                        true
                                    );

                                    handleDiagnosisClick(
                                        repair.id
                                    );

                                }}
                            >
                                Create Diagnosis
                            </button>

                        )}


                        {/* Diagnosis Pending */}

                        {diagnosisPending && (

                            <div className="workflow-info">

                                <button
                                    className="secondary-button"
                                    type="button"
                                    onClick={() =>
                                        handleDiagnosisClick(
                                            repair.id
                                        )
                                    }
                                >
                                    View Diagnosis
                                </button>

                                <span>
                                    Waiting for customer approval.
                                </span>

                            </div>

                        )}


                        {/* Diagnosis Approved */}

                        {diagnosisApproved && (

                            <div className="workflow-info">

                                <button
                                    className="primary-button"
                                    type="button"
                                    onClick={() => {

                                        handleDiagnosisClick(
                                            repair.id
                                        );

                                        setShowCompletionForm(
                                            true
                                        );

                                    }}
                                >
                                    Complete Repair
                                </button>

                                <span>
                                    Customer approved
                                    the diagnosis.
                                </span>

                            </div>

                        )}

                    </div>

                )}


                {/* =================================================
                    AWAITING CUSTOMER APPROVAL
                ================================================= */}

                {isAwaitingApproval && (

                    <div className="workflow-info">

                        <span>
                            Waiting for customer
                            approval.
                        </span>

                        <button
                            className="secondary-button"
                            type="button"
                            onClick={() =>
                                handleDiagnosisClick(
                                    repair.id
                                )
                            }
                        >
                            View Diagnosis
                        </button>

                    </div>

                )}


                {/* =================================================
                    READY FOR PICKUP
                ================================================= */}

                {isReadyForPickup && (

                    <div className="workflow-info">

                        <span>
                            Repair is ready for
                            customer pickup.
                        </span>

                        <button
                            className="primary-button"
                            type="button"
                            onClick={() =>
                                handleStatusUpdate(
                                    repair.id,
                                    "COMPLETED"
                                )
                            }
                        >
                            Mark as Completed
                        </button>

                    </div>

                )}


                {/* =================================================
                    COMPLETED
                ================================================= */}

                {isCompleted && (

                    <div className="workflow-complete">
                        Repair completed successfully.
                    </div>

                )}


                {/* =================================================
                    CANCELLED
                ================================================= */}

                {isCancelled && (

                    <div className="workflow-cancelled">
                        Repair cancelled.
                    </div>

                )}

            </div>

        </div>
    );
}


export default TechnicianRepairCard;
