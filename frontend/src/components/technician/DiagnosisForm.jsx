function DiagnosisForm({
    diagnosisText,
    setDiagnosisText,
    recommendedAction,
    setRecommendedAction,
    estimatedCost,
    setEstimatedCost,
    handleCreateDiagnosis
}) {

    return (
        <form
            className="technician-form"
            onSubmit={handleCreateDiagnosis}
        >

            {/* =================================================
                FORM HEADING
            ================================================= */}

            <div className="form-section-title">

                <h3>
                    Create Diagnosis
                </h3>

                <p>
                    Record your findings and
                    recommended repair.
                </p>

            </div>


            {/* =================================================
                DIAGNOSIS
            ================================================= */}

            <div className="form-field">

                <label htmlFor="diagnosis">
                    Diagnosis
                </label>

                <textarea
                    id="diagnosis"
                    value={diagnosisText}
                    onChange={(event) =>
                        setDiagnosisText(
                            event.target.value
                        )
                    }
                    placeholder="Describe what you found with the device."
                    rows="4"
                    required
                />

            </div>


            {/* =================================================
                RECOMMENDED ACTION
            ================================================= */}

            <div className="form-field">

                <label htmlFor="recommended-action">
                    Recommended Action
                </label>

                <textarea
                    id="recommended-action"
                    value={recommendedAction}
                    onChange={(event) =>
                        setRecommendedAction(
                            event.target.value
                        )
                    }
                    placeholder="Describe the repair work you recommend."
                    rows="4"
                    required
                />

            </div>


            {/* =================================================
                ESTIMATED COST
            ================================================= */}

            <div className="form-field">

                <label htmlFor="estimated-cost">
                    Estimated Cost
                </label>

                <input
                    id="estimated-cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={estimatedCost}
                    onChange={(event) =>
                        setEstimatedCost(
                            event.target.value
                        )
                    }
                    placeholder="0"
                />

            </div>


            {/* =================================================
                FORM ACTIONS
            ================================================= */}

            <div className="form-actions">

                <button
                    className="primary-button"
                    type="submit"
                >
                    Create Diagnosis
                </button>

            </div>

        </form>
    );
}


export default DiagnosisForm;
