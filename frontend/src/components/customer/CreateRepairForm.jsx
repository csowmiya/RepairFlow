function CreateRepairForm({
    deviceType,
    setDeviceType,
    deviceBrand,
    setDeviceBrand,
    deviceModel,
    setDeviceModel,
    problemDescription,
    setProblemDescription,
    handleCreateRepair
}) {

    return (
        <>
            <div className="section-heading">

                <div>

                    <h2>
                        Create New Repair
                    </h2>

                    <p>
                        Submit your device details and
                        describe the issue.
                    </p>

                </div>

            </div>


            <form
                className="repair-form-card"
                onSubmit={handleCreateRepair}
            >

                {/* Device Type */}

                <div className="form-field">

                    <label htmlFor="device-type">
                        Device Type
                    </label>

                    <input
                        id="device-type"
                        type="text"
                        value={deviceType}
                        onChange={(event) =>
                            setDeviceType(
                                event.target.value
                            )
                        }
                        placeholder="Laptop"
                        autoComplete="off"
                        required
                    />

                </div>


                {/* Device Brand */}

                <div className="form-field">

                    <label htmlFor="device-brand">
                        Device Brand
                    </label>

                    <input
                        id="device-brand"
                        type="text"
                        value={deviceBrand}
                        onChange={(event) =>
                            setDeviceBrand(
                                event.target.value
                            )
                        }
                        placeholder="Lenovo"
                        autoComplete="off"
                        required
                    />

                </div>


                {/* Device Model */}

                <div className="form-field">

                    <label htmlFor="device-model">
                        Device Model
                    </label>

                    <input
                        id="device-model"
                        type="text"
                        value={deviceModel}
                        onChange={(event) =>
                            setDeviceModel(
                                event.target.value
                            )
                        }
                        placeholder="IdeaPad 3"
                        autoComplete="off"
                        required
                    />

                </div>


                {/* Problem Description */}

                <div className="form-field form-field-full">

                    <label htmlFor="problem-description">
                        Problem Description
                    </label>

                    <textarea
                        id="problem-description"
                        value={problemDescription}
                        onChange={(event) =>
                            setProblemDescription(
                                event.target.value
                            )
                        }
                        placeholder="Describe the problem with your device"
                        rows="4"
                        required
                    />

                </div>


                {/* Form Actions */}

                <div className="form-actions">

                    <button
                        className="primary-button"
                        type="submit"
                    >
                        Create Repair
                    </button>

                </div>

            </form>
        </>
    );
}


export default CreateRepairForm;
