function CompleteRepairForm({
    actualAction,
    setActualAction,
    finalCost,
    setFinalCost,
    handleCompleteRepair
}) {

    return (
        <form
            className="technician-form completion-form"
            onSubmit={handleCompleteRepair}
        >

            {/* =================================================
                FORM HEADING
            ================================================= */}

            <div className="form-section-title">

                <h3>
                    Complete Repair
                </h3>

                <p>
                    Record the actual work performed
                    and final cost.
                </p>

            </div>


            {/* =================================================
                ACTUAL ACTION
            ================================================= */}

            <div className="form-field">

                <label htmlFor="actual-action">
                    Actual Action
                </label>

                <textarea
                    id="actual-action"
                    value={actualAction}
                    onChange={(event) =>
                        setActualAction(
                            event.target.value
                        )
                    }
                    placeholder="Describe the work actually performed."
                    rows="4"
                    required
                />

            </div>


            {/* =================================================
                FINAL COST
            ================================================= */}

            <div className="form-field">

                <label htmlFor="final-cost">
                    Final Cost
                </label>

                <input
                    id="final-cost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={finalCost}
                    onChange={(event) =>
                        setFinalCost(
                            event.target.value
                        )
                    }
                    placeholder="0"
                    required
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
                    Mark Ready for Pickup
                </button>

            </div>

        </form>
    );
}


export default CompleteRepairForm;
