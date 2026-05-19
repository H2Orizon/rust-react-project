import React, { useState } from "react"
import dayjs, { Dayjs } from "dayjs"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useAuth } from "../../context/AuthContext"
import type { CreateBookingDto } from "@shared/types/booking"
import { createBooking } from "@api/bookings"
import toast from "react-hot-toast"

type Props={
    resorsId:number
}

export default function BookingForm({resorsId}: Props){

    const {user} = useAuth()

    const [form, setForm] = useState<CreateBookingDto>({
        resource_id: Number(resorsId),
        user_id: Number(user?.id),
        location: "",
        quantity: 0,
        start_date: new Date(),
        end_date: new Date()
    })

    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs())
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs())
    
    const [error, setError] = useState<string | null>(null)

    const handleStartChange = (value: Dayjs | null) =>{
        setStartDate(value)

        setForm(prev =>({
                ...prev,
                startDate: value?.toDate() || new Date()
            })
        )

        alert(value)
    }

    const handleEndChange = (value: Dayjs | null) =>{
        setEndDate(value)

        setForm(perv =>({
                ...perv,
                end_date: value?.toDate() || new Date()
            })
        )

        alert(value)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        
        const { name, value } = e.target
        
        setForm(prev => ({
            ...prev,
            [name]: name === "quantity"
                ? Number(value)
                : value
        }))
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()

        try {
            setError(null)
            await createBooking({
                ...form,
                start_date: startDate?.toISOString() ?? new Date().toISOString(),
                end_date: endDate?.toISOString() ?? new Date().toISOString()
            })

            toast.success("Booking Created")

        } catch (error) {
            setError("Failed to create booking")
        }
    }

    return (
        <div className="card">
            <form
                className="form"
                onSubmit={handleSubmit}
            >

                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}

                <div className="form-group">

                    <label className="form-label">
                        Location
                    </label>

                    <input
                        className="input"
                        name="location"
                        placeholder="Enter location"
                        onChange={handleChange}
                    />

                </div>

                <div className="form-group">

                    <label className="form-label">
                        Quantity
                    </label>

                    <input
                        className="input"
                        name="quantity"
                        type="number"
                        placeholder="Enter quantity"
                        onChange={handleChange}
                    />

                </div>

                <LocalizationProvider dateAdapter={AdapterDayjs}>

                    <div className="grid grid-2">

                        <div className="form-group">

                            <DateTimePicker
                                label="Start Date"
                                value={startDate}
                                onChange={handleStartChange}
                            />

                        </div>

                        <div className="form-group">

                            <DateTimePicker
                                label="End Date"
                                value={endDate}
                                onChange={handleEndChange}
                            />

                        </div>

                    </div>

                </LocalizationProvider>

                <div className="section-actions">

                    <button className="btn btn-primary">
                        Book Resource
                    </button>

                </div>

            </form>
        </div>
    )
}