import React, { useState } from "react";
import { useNavigate } from "react-router";
import type { ResgisterUser } from "../types/users";
import { registerUser } from "../api/users";

export default function Register(){

    const navigator = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState<ResgisterUser>({
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
        <form onSubmit={handleSubmit}>
            {error && <p style={{color:"red"}}>{error}</p>}

            <input name="username"
                placeholder=""
                value={form.username}
                onChange={handleChange}
            />
            <input name="email"
                type="email"
                placeholder=""
                value={form.email}
                onChange={handleChange}
            />
            <input name="phone"
                placeholder=""
                value={form.phone}
                onChange={handleChange}
            />
            <input name="city"
                placeholder=""
                value={form.city}
                onChange={handleChange}
            />
            <input name="password"
                type="password"
                placeholder=""
                value={form.password}
                onChange={handleChange}
            />
            <input name="password_conf"
                type="password"
                placeholder=""
                value={form.password_conf}
                onChange={handleChange}
            />
            <button disabled={loading}>
                {loading ? "Creating..." : "Create user"}
            </button>
        </form>
    )
}