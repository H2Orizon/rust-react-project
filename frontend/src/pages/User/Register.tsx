import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { RegisterUserDto } from "@shared/types/users";
import { registerUser } from "@api/users";
import PhoneInput, {isPossiblePhoneNumber} from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { useLocationForm } from "@shared/hooks/useLocationForm";
import toast from "react-hot-toast";

export default function Register(){

    const navigator = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [phone, setPhone] = useState("")

    const [form, setForm] = useState<RegisterUserDto>({
        username: "",
        email: "",
        phone: "",
        city: "",
        password: "",
        password_conf: ""
    })
    
    const locationForm = useLocationForm(form.city)

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            city:
                locationForm.location
        }))

    }, [locationForm.location])

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

        if(!isPossiblePhoneNumber(phone)){
            return "Invalid phone number"
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

            await registerUser({...form, phone})

            navigator("/auth/login")
        } catch (err) {
            toast.error("Faild to create Account")

            setError("Failed to create account")
        }finally{
            setLoading(false)
        }
    }

       useEffect(() => {
            setForm(prev => ({
                ...prev,
                city: locationForm.location
            }))
        }, [])
        

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

                    <PhoneInput
                        international
                        value={phone}
                        onChange={(value) =>
                            setPhone(value || "")
                        }
                    />

                    <select
                        name="country"
                        onChange={(e) =>
                            locationForm.selectCountry(
                                e.target.value
                            )
                        }
                        value={locationForm.country || ""}
                    >
                        <option selected disabled>Select a country</option>
                        <option value="">"N/A"</option>
                        {locationForm.countries.map(c => (
                            <option key={c.cca2} value={c.name.common}>
                                {c.flag + " " + c.name.common}
                            </option>
                        ))}
                    </select>

                    {locationForm.country && (
                        <>
                        <select
                            name="city"
                            onChange={(e) => locationForm.selectCity(e.target.value)}
                            value={locationForm.city || ""}
                        >
                            <option selected value={""} disabled>Select a city</option>
                            <option value={""}>"N/A"</option>
                            {locationForm.cities.map(c => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select> 
                        <span>{form.city}</span>
                        </>
                    )}

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