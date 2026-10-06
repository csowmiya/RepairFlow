function RepairHistory({
    selectedRepairId,
    history,
    historyLoading
}) {

    if (!selectedRepairId) {
        return null;
    }


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


    return (
        <div className="history-section">

            {/* =================================================
                HISTORY HEADING
            ================================================= */}

            <div className="section-heading">

                <div>

                    <h2>
                        Repair #{selectedRepairId} History
                    </h2>

                    <p>
                        Track every status change in
                        your repair.
                    </p>

                </div>

            </div>


            {/* =================================================
                LOADING
            ================================================= */}

            {historyLoading && (
                <div className="state-message">
                    Loading repair history...
                </div>
            )}


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {!historyLoading &&
                history.length === 0 && (

                    <div className="empty-state">
                        No history available for this repair.
                    </div>

                )}


            {/* =================================================
                HISTORY TIMELINE
            ================================================= */}

            {!historyLoading &&
                history.length > 0 && (

                    <div className="history-card">

                        {history.map((item, index) => (

                            <div
                                className="history-item"
                                key={item.id}
                            >

                                {/* Timeline marker */}

                                <div className="history-marker">

                                    <div className="history-dot" />

                                    {index <
                                        history.length - 1 && (

                                        <div className="history-line" />

                                    )}

                                </div>


                                {/* History content */}

                                <div className="history-content">

                                    <div className="history-status">

                                        {item.oldStatus ? (
                                            <>
                                                <span>
                                                    {item.oldStatus}
                                                </span>

                                                <span className="history-arrow">
                                                    →
                                                </span>
                                            </>
                                        ) : null}

                                        <span>
                                            {item.newStatus}
                                        </span>

                                    </div>


                                    <div className="history-description">

                                        {item.description}

                                    </div>


                                    <div className="history-time">

                                        {formatDateTime(
                                            item.changedAt
                                        )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

        </div>
    );
}


export default RepairHistory;