import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

import AdminOverview from "../components/admin/AdminOverview";
import TechnicianList from "../components/admin/TechnicianList";
import UserManagement from "../components/admin/UserManagement";
import AdminRepairCard from "../components/admin/AdminRepairCard";


function AdminDashboard() {

    const [technicians, setTechnicians] =
        useState([]);

    const [repairs, setRepairs] =
        useState([]);

    const [history, setHistory] =
        useState([]);

    const [selectedHistoryRepair, setSelectedHistoryRepair] =
        useState(null);

    const [historyLoading, setHistoryLoading] =
        useState(false);


    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");


    const [adminName, setAdminName] =
        useState("");

    const [adminEmail, setAdminEmail] =
        useState("");

    const [adminPassword, setAdminPassword] =
        useState("");


    const [selectedTechnicians, setSelectedTechnicians] =
        useState({});


    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");


    useEffect(() => {

        fetchTechnicians();
        fetchRepairs();

    }, []);


    const fetchTechnicians = async () => {

        try {

            const response =
                await api.get(
                    "/admin/technicians"
                );

            setTechnicians(
                response.data
            );

        } catch (error) {

            console.log(
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to load technicians."
            );

        } finally {

            setLoading(false);
        }
    };


    const fetchRepairs = async () => {

        try {

            const response =
                await api.get(
                    "/repairs"
                );

            setRepairs(
                response.data
            );

        } catch (error) {

            console.log(
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to load repairs."
            );
        }
    };


    const handleCreateTechnician = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setMessage("");


        try {

            await api.post(
                "/admin/technicians",
                {
                    name,
                    email,
                    password
                }
            );


            setMessage(
                "Technician created successfully."
            );


            setName("");
            setEmail("");
            setPassword("");


            await fetchTechnicians();

        } catch (error) {

            console.log(
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to create technician."
            );
        }
    };


    const handleCreateAdmin = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setMessage("");


        try {

            await api.post(
                "/admin/admins",
                {
                    name: adminName,
                    email: adminEmail,
                    password: adminPassword
                }
            );


            setMessage(
                "Admin created successfully."
            );


            setAdminName("");
            setAdminEmail("");
            setAdminPassword("");

        } catch (error) {

            console.log(
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to create admin."
            );
        }
    };


    const handleAssignTechnician = async (
        repairId
    ) => {

        const technicianId =
            selectedTechnicians[repairId];


        if (!technicianId) {

            setError(
                "Please select a technician."
            );

            return;
        }


        setError("");
        setMessage("");


        try {

            await api.put(
                `/repairs/${repairId}/assign`,
                {
                    technicianId:
                        Number(technicianId)
                }
            );


            setMessage(
                `Technician assigned to Repair #${repairId}.`
            );


            await fetchRepairs();


            setSelectedTechnicians(
                (previous) => ({
                    ...previous,
                    [repairId]: ""
                })
            );

        } catch (error) {

            console.log(
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to assign technician."
            );
        }
    };


    const handleViewHistory = async (
        repairId
    ) => {

        setHistoryLoading(true);

        setSelectedHistoryRepair(
            repairId
        );


        try {

            const response =
                await api.get(
                    `/repairs/${repairId}/history`
                );


            setHistory(
                response.data
            );

        } catch (error) {

            console.log(
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to load repair history."
            );

            setHistory([]);

        } finally {

            setHistoryLoading(false);
        }
    };


    return (
        <DashboardLayout>

            {/* Page Header */}

            <div className="section-heading">

                <div>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Manage technicians, administrators,
                        and repair assignments.
                    </p>

                </div>

            </div>


            {/* Messages */}

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}


            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}


            {/* Overview */}

            <AdminOverview
                technicians={technicians}
                repairs={repairs}
            />


            {/* Technicians */}

            <TechnicianList
                technicians={technicians}
                loading={loading}
            />


            {/* User Management */}

            <UserManagement
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}

                adminName={adminName}
                setAdminName={setAdminName}
                adminEmail={adminEmail}
                setAdminEmail={setAdminEmail}
                adminPassword={adminPassword}
                setAdminPassword={
                    setAdminPassword
                }

                handleCreateTechnician={
                    handleCreateTechnician
                }

                handleCreateAdmin={
                    handleCreateAdmin
                }
            />


            {/* All Repairs */}

            <section className="admin-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            All Repairs
                        </h2>

                        <p>
                            Monitor repair requests and
                            assign technicians.
                        </p>

                    </div>

                </div>


                {repairs.length === 0 ? (

                    <div className="empty-state">
                        No repairs found.
                    </div>

                ) : (

                    <div className="admin-repairs">

                        {repairs.map(
                            (repair) => (

                                <AdminRepairCard
                                    key={repair.id}
                                    repair={repair}
                                    technicians={
                                        technicians
                                    }
                                    selectedTechnicians={
                                        selectedTechnicians
                                    }
                                    setSelectedTechnicians={
                                        setSelectedTechnicians
                                    }
                                    handleAssignTechnician={
                                        handleAssignTechnician
                                    }
                                    handleViewHistory={
                                        handleViewHistory
                                    }
                                    selectedHistoryRepair={
                                        selectedHistoryRepair
                                    }
                                    history={history}
                                    historyLoading={
                                        historyLoading
                                    }
                                />

                            )
                        )}

                    </div>

                )}

            </section>

        </DashboardLayout>
    );
}


export default AdminDashboard;
