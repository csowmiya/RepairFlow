function DiagnosisCard({
    diagnosis,
    approvalLoading,
    repairs,
    handleDiagnosisApproval
}) {

    if (!diagnosis) {
        return null;
    }


    const repair = repairs.find(
        (item) =>
            item.id === diagnosis.repairId
    );


    const formatDateTime = (dateTime) => {

        if (!dateTime) {
            return "Date unavailable";
        }

        return new Date(dateTime).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        );
    };


    const formatCost = (cost) => {

        if (cost === null || cost === undefined) {
            return "Not provided";
        }

        return `₹${cost}`;
    };


    const isPending =
        diagnosis.approvalStatus === "PENDING";

    const isApproved =
        diagnosis.approvalStatus === "APPROVED";

    const isRejected =
        diagnosis.approvalStatus === "REJECTED";


    return (
        <div className="diagnosis-section">

            {/* =================================================
                SECTION HEADING
            ================================================= */}

            <div className="section-heading">

                <div>

                    <h2>
                        Diagnosis — Repair #{diagnosis.repairId}
                    </h2>

                    <p>
                        Review the technician's diagnosis
                        and repair recommendation.
                    </p>

                </div>

            </div>


            {/* =================================================
                DIAGNOSIS CARD
            ================================================= */}

            <div className="diagnosis-card">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="diagnosis-header">

                    <div>

                        <span className="detail-label">
                            Technician
                        </span>

                        <h3>
                            {diagnosis.technicianName ||
                                "Technician"}
                        </h3>

                        <p className="diagnosis-email">
                            {diagnosis.technicianEmail ||
                                "Email unavailable"}
                        </p>

                    </div>


                    <div>

                        <span className="detail-label">
                            Approval
                        </span>

                        <span
                            className={
                                `approval-badge approval-${(
                                    diagnosis.approvalStatus ||
                                    "PENDING"
                                ).toLowerCase()}`
                            }
                        >
                            {diagnosis.approvalStatus}
                        </span>

                    </div>

                </div>


                {/* =================================================
                    DIAGNOSIS DETAILS
                ================================================= */}

                <div className="diagnosis-details">

                    <div className="diagnosis-detail-block">

                        <span className="detail-label">
                            Diagnosis
                        </span>

                        <p>
                            {diagnosis.diagnosis}
                        </p>

                    </div>


                    <div className="diagnosis-detail-block">

                        <span className="detail-label">
                            Recommended Action
                        </span>

                        <p>
                            {diagnosis.recommendedAction}
                        </p>

                    </div>


                    <div className="diagnosis-cost">

                        <div>

                            <span className="detail-label">
                                Estimated Cost
                            </span>

                            <strong>
                                {formatCost(
                                    diagnosis.estimatedCost
                                )}
                            </strong>

                        </div>


                        <div>

                            <span className="detail-label">
                                Diagnosed At
                            </span>

                            <span className="diagnosis-time">
                                {formatDateTime(
                                    diagnosis.diagnosedAt
                                )}
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    CUSTOMER APPROVAL
                ================================================= */}

                {isPending && (

                    <div className="approval-panel">

                        <h3>
                            Review & Approve
                        </h3>

                        <p>
                            Please review the diagnosis and
                            estimated cost before deciding
                            whether to proceed with the repair.
                        </p>


                        <div className="approval-actions">

                            <button
                                className="approve-button"
                                type="button"
                                disabled={approvalLoading}
                                onClick={() =>
                                    handleDiagnosisApproval(
                                        diagnosis.repairId,
                                        "APPROVED"
                                    )
                                }
                            >
                                {approvalLoading
                                    ? "Processing..."
                                    : "Approve Diagnosis"}
                            </button>


                            <button
                                className="reject-button"
                                type="button"
                                disabled={approvalLoading}
                                onClick={() =>
                                    handleDiagnosisApproval(
                                        diagnosis.repairId,
                                        "REJECTED"
                                    )
                                }
                            >
                                {approvalLoading
                                    ? "Processing..."
                                    : "Reject Diagnosis"}
                            </button>

                        </div>

                    </div>

                )}


                {/* =================================================
                    APPROVED MESSAGE
                ================================================= */}

                {isApproved && (

                    <div className="diagnosis-message success">

                        <strong>
                            Diagnosis approved.
                        </strong>


                        {repair?.status === "IN_PROGRESS" && (

                            <p>
                                The technician is now
                                completing the repair.
                            </p>

                        )}


                        {repair?.status === "READY_FOR_PICKUP" && (

                            <p>
                                Your repair is ready for pickup.
                            </p>

                        )}


                        {repair?.status === "COMPLETED" && (

                            <p>
                                Your repair has been completed.
                            </p>

                        )}

                    </div>

                )}


                {/* =================================================
                    REJECTED MESSAGE
                ================================================= */}

                {isRejected && (

                    <div className="diagnosis-message rejected">

                        <strong>
                            Diagnosis rejected.
                        </strong>

                        <p>
                            The repair request has been cancelled.
                        </p>

                    </div>

                )}


                {/* =================================================
                    COMPLETED REPAIR DETAILS
                ================================================= */}

                {diagnosis.actualAction && (

                    <div className="completed-repair">

                        <div className="completed-repair-header">

                            <div>

                                <h3>
                                    Completed Repair
                                </h3>

                                <p>
                                    Details of the work performed
                                    by the technician.
                                </p>

                            </div>

                        </div>


                        <div className="completed-repair-details">

                            <div>

                                <span className="detail-label">
                                    Actual Action
                                </span>

                                <p>
                                    {diagnosis.actualAction}
                                </p>

                            </div>


                            <div>

                                <span className="detail-label">
                                    Final Cost
                                </span>

                                <strong className="final-cost">
                                    {formatCost(
                                        diagnosis.finalCost
                                    )}
                                </strong>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}


export default DiagnosisCard;