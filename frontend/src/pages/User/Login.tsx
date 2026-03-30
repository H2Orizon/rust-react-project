import React, { useState } from "react";
import { useNavigate } from "react-router";
import type { UserLogin } from "../../types/users";
import { loginUser } from "../../api/users";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const navigate = useNavigate()
    const {login} = useAuth()

    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState<UserLogin>({
        email: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()

        try {
            setError(null)
            login(await loginUser(form))

            navigate("/")

        } catch (error) {
            setError("Invalid credentials")
        }
    }

    return(
        <div className="auth-container">
            <div className="auth-card">

                <h2>Login</h2>

                <form onSubmit={handleSubmit} className="auth-form">

                    {error && (<p className="auth-error"> {error} </p>)}

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                    />

                    <button type="submit" className="auth-button">
                        Login
                    </button>

                </form>

                <div className="auth-footer">
                    No account? <a href="/auth/register">Register</a>
                </div>

            </div>
        </div>
    )
}