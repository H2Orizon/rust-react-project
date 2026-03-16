import React, { useState } from "react";
import { useNavigate } from "react-router";
import type { UserLogin } from "../types/users";
import { loginUser } from "../api/users";

export default function Login() {
    const navigate = useNavigate()

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

            const tokens = await loginUser(form)
            localStorage.setItem("access_token", tokens)

            navigate("/")

        } catch (error) {
            setError("Invalid credentials")
        }
    }

    return(
    <form onSubmit={handleSubmit}>

      <h2>Login</h2>

      {error && <p style={{color:"red"}}>{error}</p>}

      <input name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <button type="submit">
        Login
      </button>

    </form>
    )
}