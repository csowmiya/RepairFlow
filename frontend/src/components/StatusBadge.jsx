function StatusBadge({ status }) {

    const statusClass = status
        ? status.toLowerCase().replaceAll("_", "-")
        : "";

    return (
        <span className={`status-badge status-${statusClass}`}>
            {status?.replaceAll("_", " ")}
        </span>
    );
}

export default StatusBadge;