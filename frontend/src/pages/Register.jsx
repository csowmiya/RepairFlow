import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


function Register() {

    const navigate =
        useNavigate();


    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");


    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleRegister = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);


        try {

            await api.post(
                "/auth/register",
                {
                    name,
                    email,
                    password
                }
            );


            setMessage(
                "Registration successful. You can now log in."
            );


            setName("");
            setEmail("");
            setPassword("");

        } catch (error) {

            console.log(
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Registration failed."
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* Brand */}

                <div className="auth-brand">

                    <div className="auth-logo">
                        R
                    </div>

                    <div>

                        <h1>
                            RepairFlow
                        </h1>

                        <p>
                            Repair Management System
                        </p>

                    </div>

                </div>


                {/* Heading */}

                <div className="auth-heading">

                    <h2>
                        Create your account
                    </h2>

                    <p>
                        Register as a customer to submit
                        and track repairs.
                    </p>

                </div>


                {/* Registration Form */}

                <form
                    onSubmit={handleRegister}
                    className="auth-form"
                >

                    <div className="form-group">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            autoComplete="name"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="register-email">
                            Email
                        </label>

                        <input
                            id="register-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            autoComplete="email"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="register-password">
                            Password
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            autoComplete="new-password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>


                {/* Messages */}

                {message && (
                    <div className="alert alert-success auth-alert">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="alert alert-error auth-alert">
                        {error}
                    </div>
                )}


                {/* Login Link */}

                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        className="auth-link-button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Sign in
                    </button>

                </div>

            </div>

        </div>
    );
}


export default Register;
