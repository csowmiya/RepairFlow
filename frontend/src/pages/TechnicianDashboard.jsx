import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

import TechnicianRepairCard from "../components/technician/TechnicianRepairCard";
import DiagnosisForm from "../components/technician/DiagnosisForm";
import CompleteRepairForm from "../components/technician/CompleteRepairForm";


function TechnicianDashboard() {

    const [repairs, setRepairs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [selectedRepairId, setSelectedRepairId] =
        useState(null);

    const [diagnosis, setDiagnosis] = useState(null);
    const [diagnosisLoading, setDiagnosisLoading] =
        useState(false);

    const [diagnosisText, setDiagnosisText] =
        useState("");

    const [recommendedAction, setRecommendedAction] =
        useState("");

    const [estimatedCost, setEstimatedCost] =
        useState("");

    const [actualAction, setActualAction] =
        useState("");

    const [finalCost, setFinalCost] =
        useState("");

    const [showDiagnosisForm, setShowDiagnosisForm] =
        useState(false);

    const [showCompletionForm, setShowCompletionForm] =
        useState(false);


    // ============================================================
    // FETCH REPAIRS
    // ============================================================

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
                "Failed to load assigned repairs."
            );

        } finally {

            setLoading(false);

        }
    };


    // ============================================================
    // STATUS UPDATE
    // ============================================================

    const handleStatusUpdate = async (
        repairId,
        newStatus
    ) => {

        setError("");
        setMessage("");

        try {

            await api.put(
                `/repairs/${repairId}/status`,
                {
                    status: newStatus
                }
            );

            setMessage(
                `Repair #${repairId} updated to ${newStatus}.`
            );

            await fetchRepairs();

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.message ||
                "Failed to update repair status."
            );

        }
    };


    // ============================================================
    // VIEW / CREATE DIAGNOSIS
    // ============================================================

    const handleDiagnosisClick = async (
        repairId
    ) => {

        setError("");
        setMessage("");

        setSelectedRepairId(repairId);

        setDiagnosis(null);

        setDiagnosisText("");
        setRecommendedAction("");
        setEstimatedCost("");

        setActualAction("");
        setFinalCost("");

        setShowDiagnosisForm(false);
        setShowCompletionForm(false);

        setDiagnosisLoading(true);

        try {

            const response =
                await api.get(
                    `/repairs/${repairId}/diagnosis`
                );

            const data = response.data;

            setDiagnosis(data);

            setDiagnosisText(
                data.diagnosis || ""
            );

            setRecommendedAction(
                data.recommendedAction || ""
            );

            setEstimatedCost(
                data.estimatedCost ?? ""
            );

        } catch (error) {

            if (error.response?.status === 404) {

                // No diagnosis exists yet.
                // Technician can create one.

                setDiagnosis(null);

                setShowDiagnosisForm(true);

            } else {

                console.log(
                    error.response?.data
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load diagnosis."
                );

            }

        } finally {

            setDiagnosisLoading(false);

        }
    };


    // ============================================================
    // CREATE DIAGNOSIS
    // ============================================================

    const handleCreateDiagnosis = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setMessage("");

        try {

            const response =
                await api.post(
                    `/repairs/${selectedRepairId}/diagnosis`,
                    {
                        diagnosis:
                            diagnosisText,

                        recommendedAction:
                            recommendedAction,

                        estimatedCost:
                            estimatedCost === ""
                                ? null
                                : Number(estimatedCost)
                    }
                );

            setDiagnosis(response.data);

            setShowDiagnosisForm(false);

            setMessage(
                `Diagnosis for Repair #${selectedRepairId} created successfully.`
            );

            await fetchRepairs();

        } catch (error) {

            console.log(
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to create diagnosis."
            );

        }
    };


    // ============================================================
    // COMPLETE REPAIR
    // ============================================================

    const handleCompleteRepair = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setMessage("");

        try {

            const response =
                await api.put(
                    `/repairs/${selectedRepairId}/complete`,
                    {
                        actualAction:
                            actualAction,

                        finalCost:
                            Number(finalCost)
                    }
                );

            setDiagnosis(response.data);

            setShowCompletionForm(false);

            setMessage(
                `Repair #${selectedRepairId} is now ready for pickup.`
            );

            await fetchRepairs();

        } catch (error) {

            console.log(
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Failed to complete repair."
            );

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
                        Technician Dashboard
                    </h1>

                    <p>
                        Manage assigned repairs, diagnose
                        issues, and complete repair work.
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
                ASSIGNED REPAIRS
            ================================================= */}

            <div className="section-heading technician-section-heading">

                <div>

                    <h2>
                        My Assigned Repairs
                    </h2>

                    <p>
                        Review and manage the repairs
                        assigned to you.
                    </p>

                </div>

            </div>


            {loading && (
                <div className="state-message">
                    Loading assigned repairs...
                </div>
            )}


            {!loading &&
                repairs.length === 0 && (

                    <div className="empty-state">
                        No repairs are currently assigned
                        to you.
                    </div>

                )}


            {!loading &&
                repairs.length > 0 && (

                    <div className="technician-repairs">

                        {repairs.map((repair) => (

                            <TechnicianRepairCard
                                key={repair.id}
                                repair={repair}
                                handleStatusUpdate={
                                    handleStatusUpdate
                                }
                                handleDiagnosisClick={
                                    handleDiagnosisClick
                                }
                                setShowDiagnosisForm={
                                    setShowDiagnosisForm
                                }
                                setShowCompletionForm={
                                    setShowCompletionForm
                                }
                            />

                        ))}

                    </div>

                )}


            {/* =================================================
                DIAGNOSIS / COMPLETION
            ================================================= */}

            {selectedRepairId && (

                <div className="technician-work-section">

                    <div className="section-heading">

                        <div>

                            <h2>
                                Repair #{selectedRepairId}
                            </h2>

                            <p>
                                Diagnosis and repair
                                completion details.
                            </p>

                        </div>

                    </div>


                    {diagnosisLoading && (

                        <div className="state-message">
                            Loading diagnosis...
                        </div>

                    )}


                    {!diagnosisLoading && (

                        <div className="technician-work-card">

                            {/* =================================================
                                CREATE DIAGNOSIS
                            ================================================= */}

                            {showDiagnosisForm &&
                                !diagnosis && (

                                <DiagnosisForm
                                    diagnosisText={
                                        diagnosisText
                                    }
                                    setDiagnosisText={
                                        setDiagnosisText
                                    }
                                    recommendedAction={
                                        recommendedAction
                                    }
                                    setRecommendedAction={
                                        setRecommendedAction
                                    }
                                    estimatedCost={
                                        estimatedCost
                                    }
                                    setEstimatedCost={
                                        setEstimatedCost
                                    }
                                    handleCreateDiagnosis={
                                        handleCreateDiagnosis
                                    }
                                />

                            )}


                            {/* =================================================
                                EXISTING DIAGNOSIS
                            ================================================= */}

                            {diagnosis && (

                                <div className="technician-diagnosis">

                                    <div className="diagnosis-header">

                                        <div>

                                            <span className="detail-label">
                                                Diagnosis
                                            </span>

                                            <h3>
                                                Repair #
                                                {diagnosis.repairId}
                                            </h3>

                                        </div>


                                        <span
                                            className={
                                                `approval-badge approval-${(
                                                    diagnosis.approvalStatus ||
                                                    "PENDING"
                                                ).toLowerCase()}`
                                            }
                                        >
                                            {
                                                diagnosis.approvalStatus
                                            }
                                        </span>

                                    </div>


                                    <div className="diagnosis-details">

                                        <div className="diagnosis-detail-block">

                                            <span className="detail-label">
                                                Diagnosis
                                            </span>

                                            <p>
                                                {
                                                    diagnosis.diagnosis
                                                }
                                            </p>

                                        </div>


                                        <div className="diagnosis-detail-block">

                                            <span className="detail-label">
                                                Recommended Action
                                            </span>

                                            <p>
                                                {
                                                    diagnosis.recommendedAction
                                                }
                                            </p>

                                        </div>


                                        <div className="diagnosis-cost">

                                            <div>

                                                <span className="detail-label">
                                                    Estimated Cost
                                                </span>

                                                <strong>
                                                    {
                                                        diagnosis.estimatedCost !==
                                                        null &&
                                                        diagnosis.estimatedCost !==
                                                        undefined
                                                            ? `₹${diagnosis.estimatedCost}`
                                                            : "Not provided"
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span className="detail-label">
                                                    Approval Status
                                                </span>

                                                <span className="diagnosis-time">
                                                    {
                                                        diagnosis.approvalStatus
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        COMPLETE REPAIR
                                    ================================================= */}

                                    {showCompletionForm &&
                                        diagnosis.approvalStatus ===
                                            "APPROVED" && (

                                        <CompleteRepairForm
                                            actualAction={
                                                actualAction
                                            }
                                            setActualAction={
                                                setActualAction
                                            }
                                            finalCost={
                                                finalCost
                                            }
                                            setFinalCost={
                                                setFinalCost
                                            }
                                            handleCompleteRepair={
                                                handleCompleteRepair
                                            }
                                        />

                                    )}

                                </div>

                            )}

                        </div>

                    )}

                </div>

            )}

        </DashboardLayout>
    );
}


export default TechnicianDashboard;
