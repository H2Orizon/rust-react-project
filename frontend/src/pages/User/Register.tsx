import React, { useState } from "react";
import { useNavigate } from "react-router";
import type { ResgisterUserDto } from "../../../../shared/types/users";
import { registerUser } from "../../api/users";

export default function Register(){

    const navigator = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState<ResgisterUserDto>({
        username: "",
        email: "",
        phone: "",
        city: "",
        password: "",
        password_conf: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const validate = () =>{
        if(form.username.length < 3){
            return "Name must contain at least 3 characters"
        }

        if(form.password !== form.password_conf){
            return "Passwords don't match"
        }

        return
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
    
        const validationError = validate()
        if(validationError){
            setError(validationError)
            return
        }

        try {
            setLoading(true)
            setError(null)

            await registerUser(form)

            navigator("/auth/login")
        } catch (err) {
            setError("Failed to create account")
        }finally{
            setLoading(false)
        }
    }

return(
        <div className="auth-container">
            <div className="auth-card">

                <h2>Register</h2>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <p className="auth-error">{error}</p>}

                    <input name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                    />
                    <input name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <input name="phone"
                        placeholder="phone number (optional)"
                        value={form.phone}
                        onChange={handleChange}
                    />
                    <input name="city"
                        placeholder="City (optional)"
                        value={form.city}
                        onChange={handleChange}
                    />
                    <input name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <input name="password_conf"
                        type="password"
                        placeholder="Confirm password"
                        value={form.password_conf}
                        onChange={handleChange}
                    />
                    <button disabled={loading} className="auth-button">
                        {loading ? "Creating..." : "Create user"}
                    </button>

                    <div className="auth-footer">
                        You have account? <a href="/auth/login">Login</a>
                    </div>

                </form>
            </div>
        </div>
 
    )
}