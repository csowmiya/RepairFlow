import StatusBadge from "../StatusBadge";


function AdminRepairCard({
    repair,
    technicians,
    selectedTechnicians,
    setSelectedTechnicians,
    handleAssignTechnician,
    handleViewHistory,
    selectedHistoryRepair,
    history,
    historyLoading
}) {

    const isPending =
        repair.status === "PENDING";

    const hasTechnician =
        Boolean(repair.technicianName);

    const isHistorySelected =
        selectedHistoryRepair === repair.id;

    const deviceName =
        [repair.deviceBrand, repair.deviceModel]
            .filter(Boolean)
            .join(" ") ||
        "Device";


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


    const selectedTechnician =
        selectedTechnicians[repair.id] || "";


    return (
        <div className="admin-repair-card">

            {/* Repair Header */}

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


            {/* Repair Details */}

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
                        Customer Email
                    </span>

                    <span className="detail-value">
                        {repair.customerEmail ||
                            "Email unavailable"}
                    </span>

                </div>


                <div className="repair-detail">

                    <span className="detail-label">
                        Device Type
                    </span>

                    <span className="detail-value">
                        {repair.deviceType ||
                            "Not available"}
                    </span>

                </div>


                <div className="repair-detail">

                    <span className="detail-label">
                        Problem
                    </span>

                    <span className="detail-value">
                        {repair.problemDescription ||
                            "No description provided"}
                    </span>

                </div>

            </div>


            {/* Technician Assignment */}

            {isPending && !hasTechnician && (

                <div className="admin-assignment">

                    <div className="form-field">

                        <label
                            htmlFor={`technician-${repair.id}`}
                        >
                            Assign Technician
                        </label>

                        <select
                            id={`technician-${repair.id}`}
                            value={selectedTechnician}
                            onChange={(event) =>
                                setSelectedTechnicians(
                                    (previous) => ({
                                        ...previous,
                                        [repair.id]:
                                            event.target.value
                                    })
                                )
                            }
                        >

                            <option value="">
                                Select technician
                            </option>

                            {technicians.map(
                                (technician) => (
                                    <option
                                        key={technician.id}
                                        value={technician.id}
                                    >
                                        {technician.name} —{" "}
                                        {technician.email}
                                    </option>
                                )
                            )}

                        </select>

                    </div>


                    <button
                        className="primary-button"
                        type="button"
                        onClick={() =>
                            handleAssignTechnician(
                                repair.id
                            )
                        }
                        disabled={!selectedTechnician}
                    >
                        Assign Technician
                    </button>

                </div>

            )}


            {/* Assigned Technician */}

            {hasTechnician && (

                <div className="repair-assignment-summary">

                    <span className="detail-label">
                        Assigned Technician
                    </span>

                    <span className="detail-value">
                        {repair.technicianName}
                    </span>

                </div>

            )}


            {/* Actions */}

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

            </div>


            {/* Repair History */}

            {isHistorySelected && (

                <div className="history-section">

                    <div className="section-heading">

                        <div>
                            <h4>
                                Repair #{repair.id} History
                            </h4>

                            <p>
                                Track every status change
                                and the user who made it.
                            </p>
                        </div>

                    </div>


                    {historyLoading && (

                        <div className="state-message">
                            Loading repair history...
                        </div>

                    )}


                    {!historyLoading &&
                        history.length === 0 && (

                            <div className="empty-state">
                                No history available for
                                this repair.
                            </div>

                        )}


                    {!historyLoading &&
                        history.length > 0 && (

                            <div className="history-card">

                                {history.map(
                                    (item, index) => (

                                        <div
                                            className="history-item"
                                            key={item.id}
                                        >

                                            <div className="history-marker">

                                                <div className="history-dot" />

                                                {index <
                                                    history.length - 1 && (
                                                    <div className="history-line" />
                                                )}

                                            </div>


                                            <div className="history-content">

                                                <div className="history-status">

                                                    {item.oldStatus && (
                                                        <>
                                                            <span>
                                                                {item.oldStatus}
                                                            </span>

                                                            <span className="history-arrow">
                                                                →
                                                            </span>
                                                        </>
                                                    )}

                                                    <span>
                                                        {item.newStatus}
                                                    </span>

                                                </div>


                                                <div className="history-description">
                                                    {item.description}
                                                </div>


                                                <div className="history-actor">
                                                    Changed by:{" "}
                                                    {item.changedBy ||
                                                        "Unknown user"}{" "}
                                                    (
                                                    {item.changedByRole ||
                                                        "Unknown role"}
                                                    )
                                                </div>


                                                <div className="history-time">
                                                    {formatDateTime(
                                                        item.changedAt
                                                    )}
                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </div>

            )}

        </div>
    );
}


export default AdminRepairCard;
