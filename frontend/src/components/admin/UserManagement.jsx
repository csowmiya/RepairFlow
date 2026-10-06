function UserManagement({
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    adminName,
    setAdminName,
    adminEmail,
    setAdminEmail,
    adminPassword,
    setAdminPassword,
    handleCreateTechnician,
    handleCreateAdmin
}) {

    return (
        <section className="admin-section">

            <div className="section-heading">

                <div>
                    <h2>
                        User Management
                    </h2>

                    <p>
                        Create technician and admin accounts.
                    </p>
                </div>

            </div>


            <div className="admin-user-forms">

                {/* Create Technician */}

                <form
                    className="admin-form-card"
                    onSubmit={handleCreateTechnician}
                >

                    <div className="form-section-title">

                        <h3>
                            Create Technician
                        </h3>

                        <p>
                            Add a new technician to the system.
                        </p>

                    </div>


                    <div className="form-field">

                        <label htmlFor="technician-name">
                            Name
                        </label>

                        <input
                            id="technician-name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="Technician name"
                            autoComplete="name"
                            required
                        />

                    </div>


                    <div className="form-field">

                        <label htmlFor="technician-email">
                            Email
                        </label>

                        <input
                            id="technician-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="technician@example.com"
                            autoComplete="email"
                            required
                        />

                    </div>


                    <div className="form-field">

                        <label htmlFor="technician-password">
                            Password
                        </label>

                        <input
                            id="technician-password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Password"
                            autoComplete="new-password"
                            required
                        />

                    </div>


                    <div className="form-actions">

                        <button
                            className="primary-button"
                            type="submit"
                        >
                            Create Technician
                        </button>

                    </div>

                </form>


                {/* Create Admin */}

                <form
                    className="admin-form-card"
                    onSubmit={handleCreateAdmin}
                >

                    <div className="form-section-title">

                        <h3>
                            Create Admin
                        </h3>

                        <p>
                            Add another administrator
                            to the system.
                        </p>

                    </div>


                    <div className="form-field">

                        <label htmlFor="admin-name">
                            Name
                        </label>

                        <input
                            id="admin-name"
                            type="text"
                            value={adminName}
                            onChange={(event) =>
                                setAdminName(
                                    event.target.value
                                )
                            }
                            placeholder="Admin name"
                            autoComplete="name"
                            required
                        />

                    </div>


                    <div className="form-field">

                        <label htmlFor="admin-email">
                            Email
                        </label>

                        <input
                            id="admin-email"
                            type="email"
                            value={adminEmail}
                            onChange={(event) =>
                                setAdminEmail(
                                    event.target.value
                                )
                            }
                            placeholder="admin@example.com"
                            autoComplete="email"
                            required
                        />

                    </div>


                    <div className="form-field">

                        <label htmlFor="admin-password">
                            Password
                        </label>

                        <input
                            id="admin-password"
                            type="password"
                            value={adminPassword}
                            onChange={(event) =>
                                setAdminPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Password"
                            autoComplete="new-password"
                            required
                        />

                    </div>


                    <div className="form-actions">

                        <button
                            className="primary-button"
                            type="submit"
                        >
                            Create Admin
                        </button>

                    </div>

                </form>

            </div>

        </section>
    );
}


export default UserManagement;
