function TechnicianList({
    technicians,
    loading
}) {

    return (
        <section className="admin-section">

            <div className="section-heading">

                <div>
                    <h2>
                        Technicians
                    </h2>

                    <p>
                        View and manage registered
                        technicians.
                    </p>
                </div>

            </div>


            {loading && (
                <div className="state-message">
                    Loading technicians...
                </div>
            )}


            {!loading &&
                technicians.length === 0 && (
                    <div className="empty-state">
                        No technicians found.
                    </div>
                )}


            {!loading &&
                technicians.length > 0 && (
                    <div className="technician-grid">

                        {technicians.map(
                            (technician) => {

                                const initial =
                                    technician.name
                                        ?.charAt(0)
                                        ?.toUpperCase() ||
                                    "?";

                                return (
                                    <div
                                        className="technician-card"
                                        key={technician.id}
                                    >

                                        <div className="technician-avatar">
                                            {initial}
                                        </div>


                                        <div className="technician-info">

                                            <h3>
                                                {technician.name}
                                            </h3>

                                            <p>
                                                {technician.email}
                                            </p>

                                            <span>
                                                Technician
                                            </span>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

        </section>
    );
}


export default TechnicianList;
