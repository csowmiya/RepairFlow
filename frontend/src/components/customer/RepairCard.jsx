import StatusBadge from "../StatusBadge";


function RepairCard({
    repair,
    handleViewHistory,
    handleViewDiagnosis
}) {

    const deviceName =
        [repair.deviceBrand, repair.deviceModel]
            .filter(Boolean)
            .join(" ") ||
        "Device";


    const canViewDiagnosis =
        repair.status === "AWAITING_APPROVAL" ||
        repair.status === "IN_PROGRESS" ||
        repair.status === "READY_FOR_PICKUP" ||
        repair.status === "COMPLETED";


    return (
        <div className="repair-card">

            {/* =================================================
                REPAIR HEADER
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
                        Device Type
                    </span>

                    <span className="detail-value">
                        {repair.deviceType}
                    </span>

                </div>


                <div className="repair-detail">

                    <span className="detail-label">
                        Problem
                    </span>

                    <span className="detail-value">
                        {repair.problemDescription}
                    </span>

                </div>


                <div className="repair-detail">

                    <span className="detail-label">
                        Technician
                    </span>

                    <span className="detail-value">

                        {repair.technicianName ||
                            "Not assigned yet"}

                    </span>

                </div>

            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="repair-card-actions">

                <button
                    className="secondary-button"
                    type="button"
                    onClick={() =>
                        handleViewHistory(
                            repair.id
                        )
                    }
                >
                    View History
                </button>


                {canViewDiagnosis && (

                    <button
                        className="secondary-button"
                        type="button"
                        onClick={() =>
                            handleViewDiagnosis(
                                repair.id
                            )
                        }
                    >
                        View Diagnosis
                    </button>

                )}

            </div>

        </div>
    );
}


export default RepairCard;