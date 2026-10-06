import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


function Login() {

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const navigate =
        useNavigate();


    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        setError("");
        setLoading(true);


        try {

            const response =
                await api.post(
                    "/auth/login",
                    {
                        email,
                        password
                    }
                );


            const data =
                response.data;


            localStorage.setItem(
                "token",
                data.token
            );


            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            if (data.user.role === "ADMIN") {

                navigate("/admin");

            } else if (
                data.user.role === "TECHNICIAN"
            ) {

                navigate("/technician");

            } else if (
                data.user.role === "CUSTOMER"
            ) {

                navigate("/customer");

            } else {

                setError(
                    "Unknown user role."
                );

            }

        } catch (error) {

            console.log(
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                "Invalid email or password."
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
                        Welcome back
                    </h2>

                    <p>
                        Sign in to continue to your dashboard.
                    </p>

                </div>


                {/* Error */}

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}


                {/* Login Form */}

                <form
                    onSubmit={handleSubmit}
                    className="auth-form"
                >

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
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

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            autoComplete="current-password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing In..."
                            : "Sign In"}
                    </button>

                </form>


                {/* Register Link */}

                <div className="auth-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <button
                        type="button"
                        className="auth-link-button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create an account
                    </button>

                </div>

            </div>

        </div>
    );
}


export default Login;
