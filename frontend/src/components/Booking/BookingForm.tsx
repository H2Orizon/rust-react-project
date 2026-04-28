import React, { useState } from "react"
import type { CreateBookingDto } from "../../types/booking"
import dayjs, { Dayjs } from "dayjs"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { createBooking } from "../../api/bookings"
import { useAuth } from "../../context/AuthContext"

type Props={
    resorsId:number
}

export default function BookingForm({resorsId}: Props){

    const {user} = useAuth()
    console.error(resorsId)

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
    }

    const handleEndChange = (value: Dayjs | null) =>{
        setEndDate(value)

        setForm(perv =>({
                ...perv,
                end_date: value?.toDate() || new Date()
            })
        )
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

        } catch (error) {
            setError("Failed to create booking")
        }
    }

        return (
        <div className="booking-card">
            <form className="booking-form" onSubmit={handleSubmit}>

                {error && <p className="form-error">{error}</p>}

                <input
                    name="location"
                    placeholder="Location"
                    onChange={handleChange}
                />

                <input
                    name="quantity"
                    type="number"
                    placeholder="Quantity"
                    onChange={handleChange}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>

                    <div className="booking-row">

                        <DateTimePicker
                            label="Start Date"
                            value={startDate}
                            onChange={handleStartChange}
                        />

                        <DateTimePicker
                            label="End Date"
                            value={endDate}
                            onChange={handleEndChange}
                        />

                    </div>

                </LocalizationProvider>

                <button className="btn-primary">
                    Book
                </button>

            </form>
        </div>
    )
}