import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/api";

import CreateRepairForm from "../components/customer/CreateRepairForm";
import RepairCard from "../components/customer/RepairCard";
import RepairHistory from "../components/customer/RepairHistory";
import DiagnosisCard from "../components/customer/DiagnosisCard";


function CustomerDashboard() {

    const [repairs, setRepairs] = useState([]);

    const [deviceType, setDeviceType] = useState("");
    const [deviceBrand, setDeviceBrand] = useState("");
    const [deviceModel, setDeviceModel] = useState("");
    const [problemDescription, setProblemDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [history, setHistory] = useState([]);
    const [selectedRepairId, setSelectedRepairId] = useState(null);
    const [historyLoading, setHistoryLoading] = useState(false);

    const [diagnosis, setDiagnosis] = useState(null);
    const [diagnosisLoading, setDiagnosisLoading] = useState(false);
    const [approvalLoading, setApprovalLoading] = useState(false);


    // =========================================================
    // FETCH REPAIRS
    // =========================================================

    useEffect(() => {
        fetchRepairs();
    }, []);


    const fetchRepairs = async () => {

        try {

            const response =
                await api.get("/repairs");

            setRepairs(response.data);

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.message ||
                "Failed to load repairs."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // CREATE REPAIR
    // =========================================================

    const handleCreateRepair = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");

        try {

            await api.post(
                "/repairs",
                {
                    deviceType,
                    deviceBrand,
                    deviceModel,
                    problemDescription
                }
            );

            setMessage(
                "Repair request created successfully."
            );

            setDeviceType("");
            setDeviceBrand("");
            setDeviceModel("");
            setProblemDescription("");

            await fetchRepairs();

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.message ||
                "Failed to create repair request."
            );
        }
    };


    // =========================================================
    // VIEW REPAIR HISTORY
    // =========================================================

    const handleViewHistory = async (repairId) => {

        setError("");
        setMessage("");

        setHistory([]);
        setSelectedRepairId(repairId);
        setHistoryLoading(true);

        try {

            const response =
                await api.get(
                    `/repairs/${repairId}/history`
                );

            setHistory(response.data);

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.message ||
                "Failed to load repair history."
            );

        } finally {

            setHistoryLoading(false);
        }
    };


    // =========================================================
    // VIEW DIAGNOSIS
    // =========================================================

    const handleViewDiagnosis = async (repairId) => {

        setError("");
        setMessage("");

        setDiagnosis(null);
        setDiagnosisLoading(true);

        try {

            const response =
                await api.get(
                    `/repairs/${repairId}/diagnosis`
                );

            setDiagnosis(response.data);

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.message ||
                "Failed to load diagnosis."
            );

        } finally {

            setDiagnosisLoading(false);
        }
    };


    // =========================================================
    // APPROVE / REJECT DIAGNOSIS
    // =========================================================

    const handleDiagnosisApproval = async (
        repairId,
        approvalStatus
    ) => {

        setError("");
        setMessage("");
        setApprovalLoading(true);

        try {

            await api.put(
                `/repairs/${repairId}/diagnosis/approval`,
                {
                    approvalStatus
                }
            );

            if (approvalStatus === "APPROVED") {

                setMessage(
                    "Diagnosis approved successfully."
                );

            } else {

                setMessage(
                    "Diagnosis rejected successfully."
                );
            }

            await fetchRepairs();

            await handleViewDiagnosis(
                repairId
            );

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.message ||
                "Failed to update diagnosis approval."
            );

        } finally {

            setApprovalLoading(false);
        }
    };


    return (
        <DashboardLayout>

            {/* =================================================
                PAGE HEADING
            ================================================= */}

            <div className="section-heading">

                <div>

                    <h1>
                        Customer Dashboard
                    </h1>

                    <p>
                        Create repair requests and track
                        their progress.
                    </p>

                </div>

            </div>


            {/* =================================================
                ALERTS
            ================================================= */}

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


            {/* =================================================
                CREATE REPAIR
            ================================================= */}

            <section>

                <div className="section-heading">

                    <div>

                        <h2>
                            Create Repair Request
                        </h2>

                        <p>
                            Tell us about the device and
                            the problem you are experiencing.
                        </p>

                    </div>

                </div>

                <CreateRepairForm
                    deviceType={deviceType}
                    setDeviceType={setDeviceType}
                    deviceBrand={deviceBrand}
                    setDeviceBrand={setDeviceBrand}
                    deviceModel={deviceModel}
                    setDeviceModel={setDeviceModel}
                    problemDescription={
                        problemDescription
                    }
                    setProblemDescription={
                        setProblemDescription
                    }
                    handleCreateRepair={
                        handleCreateRepair
                    }
                />

            </section>


            {/* =================================================
                MY REPAIRS
            ================================================= */}

            <section className="admin-section">

                <div className="section-heading">

                    <div>

                        <h2>
                            My Repairs
                        </h2>

                        <p>
                            Track your repair requests
                            and their current status.
                        </p>

                    </div>

                </div>


                {loading && (
                    <div className="state-message">
                        Loading repairs...
                    </div>
                )}


                {!loading &&
                    repairs.length === 0 && (
                        <div className="empty-state">
                            You have no repair requests yet.
                        </div>
                    )}


                {!loading &&
                    repairs.length > 0 && (
                        <div>
                            {repairs.map((repair) => (

                                <RepairCard
                                    key={repair.id}
                                    repair={repair}
                                    handleViewHistory={
                                        handleViewHistory
                                    }
                                    handleViewDiagnosis={
                                        handleViewDiagnosis
                                    }
                                />

                            ))}
                        </div>
                    )}

            </section>


            {/* =================================================
                REPAIR HISTORY
            ================================================= */}

            <RepairHistory
                selectedRepairId={
                    selectedRepairId
                }
                history={history}
                historyLoading={
                    historyLoading
                }
            />


            {/* =================================================
                DIAGNOSIS
            ================================================= */}

            <section className="diagnosis-section">

                {diagnosisLoading && (
                    <div className="state-message">
                        Loading diagnosis...
                    </div>
                )}

                {!diagnosisLoading && (
                    <DiagnosisCard
                        diagnosis={diagnosis}
                        approvalLoading={
                            approvalLoading
                        }
                        repairs={repairs}
                        handleDiagnosisApproval={
                            handleDiagnosisApproval
                        }
                    />
                )}

            </section>

        </DashboardLayout>
    );
}


export default CustomerDashboard;