function AdminOverview({
    technicians,
    repairs
}) {

    const totalTechnicians =
        technicians.length;

    const totalRepairs =
        repairs.length;

    const pendingRepairs =
        repairs.filter(
            (repair) =>
                repair.status === "PENDING"
        ).length;

    const completedRepairs =
        repairs.filter(
            (repair) =>
                repair.status === "COMPLETED"
        ).length;


    return (
        <div className="admin-overview">

            {/* Total Technicians */}

            <div className="admin-stat-card">

                <span className="admin-stat-label">
                    Total Technicians
                </span>

                <strong className="admin-stat-value">
                    {totalTechnicians}
                </strong>

            </div>


            {/* Total Repairs */}

            <div className="admin-stat-card">

                <span className="admin-stat-label">
                    Total Repairs
                </span>

                <strong className="admin-stat-value">
                    {totalRepairs}
                </strong>

            </div>


            {/* Pending Repairs */}

            <div className="admin-stat-card">

                <span className="admin-stat-label">
                    Pending Repairs
                </span>

                <strong className="admin-stat-value">
                    {pendingRepairs}
                </strong>

            </div>


            {/* Completed Repairs */}

            <div className="admin-stat-card">

                <span className="admin-stat-label">
                    Completed Repairs
                </span>

                <strong className="admin-stat-value">
                    {completedRepairs}
                </strong>

            </div>

        </div>
    );
}


export default AdminOverview;