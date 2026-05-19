import { createBooking } from "@/api/bookings"
import { useAuth } from "@/context/AuthContext"
import { CreateBookingDto } from "@shared/types/booking"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Text, TextInput, TouchableOpacity, View } from "react-native"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"

import { styles } from "app/styles/booking-form.styles"
import Toast from "react-native-toast-message"

type Props = {
    resorsId:number
}

export default function BookingForm({resorsId}: Props){
    const {user} = useAuth()
    const [serverError, setServerError] = useState("")
    const [loading, setLoading] = useState(false)

    const [showStartDate, setShowStartDate] = useState(false)
    const [showStartTime, setShowStartTime] = useState(false)

    const [showEndDate, setShowEndDate] = useState(false)
    const [showEndTime, setShowEndTime] = useState(false)

    const {control, watch ,setValue ,handleSubmit ,formState: {errors}} = useForm<CreateBookingDto>({
        defaultValues:{
            resource_id:resorsId,
            user_id: user?.id,
            location: "",
            quantity: 0,
            start_date: "",
            end_date: ""
        }
    })

    const startDate = watch("start_date")
    const endDate = watch("end_date")

    const handleStartDateChange = (
        e: DateTimePickerEvent,
        selectedDate?: Date
    ) => {
        setShowStartDate(false)

        if (!selectedDate) return

        const current =
            startDate
                ? new Date(startDate)
                : new Date()

        current.setFullYear(
            selectedDate.getFullYear()
        )

        current.setMonth(
            selectedDate.getMonth()
        )

        current.setDate(
            selectedDate.getDate()
        )

        setValue(
            "start_date",
            current.toISOString()
        )

        setTimeout(() => {
            setShowStartTime(true)
        }, 200)
    }

    const handleStartTimeChange = (
        e: DateTimePickerEvent,
        selectedDate?: Date
    ) => {
        setShowStartTime(false)

        if (!selectedDate) return

        const current =
            startDate
                ? new Date(startDate)
                : new Date()

        current.setHours(
            selectedDate.getHours()
        )

        current.setMinutes(
            selectedDate.getMinutes()
        )

        current.setSeconds(
            selectedDate.getSeconds()
        )

        setValue(
            "start_date",
            current.toISOString()
        )

    }

    const handleEndDateChange = (
        e: DateTimePickerEvent,
        selectedDate?: Date
    ) => {

        setShowEndDate(false)

        if (!selectedDate) return

        const current =
            endDate
                ? new Date(endDate)
                : new Date()

        current.setFullYear(
            selectedDate.getFullYear()
        )

        current.setMonth(
            selectedDate.getMonth()
        )

        current.setDate(
            selectedDate.getDate()
        )

        setValue(
            "end_date",
            current.toISOString()
        )

        setTimeout(() => {
            setShowEndTime(true)
        }, 200)
    }

    const handleEndTimeChange = (
        e: DateTimePickerEvent,
        selectedDate?: Date
    ) => {

        setShowEndTime(false)

        if (!selectedDate) return

        const current =
            endDate
                ? new Date(endDate)
                : new Date()

        current.setHours(
            selectedDate.getHours()
        )

        current.setMinutes(
            selectedDate.getMinutes()
        )

        setValue(
            "end_date",
            current.toISOString()
        )
    }

    const onSubmit = async(data: CreateBookingDto) => {
        try{
            setServerError("")
            setLoading(true)

            await createBooking(data)

            Toast.show({
                type:"success",
                text1: "Booking Created Successfully"
            })
        }catch(err: any){
            Toast.show({
                type:"error",
                text1: "Failed to create booking"
            })
            setServerError("Failed to create booking")
        }finally{
            setLoading(false)
        }
    }

    return(
        <View style={styles.container}>

            <Text style={styles.title}>
                Booking
            </Text>

            {serverError ? (
                <Text style={styles.serverError}>
                    {serverError}
                </Text>
            ) : null}

            <View style={styles.group}>
                <Text style={styles.title}>
                    Location
                </Text>

                {/* LOCATION */}

                <Controller 
                    control={control}
                    name="location" 
                    render={({field: {onChange, onBlur, value}}) =>(
                        <TextInput 
                            placeholder="Location"
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.location && (
                    <Text style={styles.error}>
                        {errors.location.message}
                    </Text>
                )}

            </View>

            {/* QUANTITY */}
            <View>

                <Text style={styles.title}>
                    Quantity
                </Text>

                <Controller 
                    control={control}
                    name="quantity"
                    rules={{required: "Quantity is required"}}
                    render={({field: {onChange, onBlur, value}}) =>(
                        <TextInput 
                            placeholder="0"
                            style={styles.input}
                            onBlur={onBlur}
                            keyboardType="numeric"
                            onChangeText={(text) => 
                                onChange(
                                    Number(text)
                                )
                            }
                            value={String(value)}
                        />
                    )}
                />

                {errors.quantity && (
                    <Text style={styles.error}>
                        {errors.quantity.message}
                    </Text>
                )}

            </View>

            {/* START */}

            <TouchableOpacity
                onPress={() =>
                    setShowStartDate(true)
                }
                style={styles.dateButton}
            >

                <Text style={styles.dateText}>

                    Start:
                    {" "}

                    {startDate
                        ? new Date(
                            startDate
                        ).toLocaleString()
                        : "Select date & time"}

                </Text>

            </TouchableOpacity>

            {/* END */}

            <TouchableOpacity
                onPress={() =>
                    setShowEndDate(true)
                }
                style={styles.dateButton}
            >

                <Text style={styles.dateText}>

                    End:
                    {" "}

                    {endDate
                        ? new Date(
                            endDate
                        ).toLocaleString()
                        : "Select date & time"}

                </Text>

            </TouchableOpacity>

            {/* START DATE */}

            {showStartDate && (

                <DateTimePicker
                    value={
                        startDate
                            ? new Date(startDate)
                            : new Date()
                    }
                    mode={"date"}
                    display="default"
                    onChange={
                        handleStartDateChange
                    }
                />
            )}

            {/* START TIME */}

            {showStartTime && (

                <DateTimePicker
                    value={
                        startDate
                            ? new Date(startDate)
                            : new Date()
                    }
                    mode={"time"}
                    is24Hour
                    display="default"
                    onChange={
                        handleStartTimeChange
                    }
                />
            )}

            {/* END DATE */}

            {showEndDate && (

                <DateTimePicker
                    value={
                        endDate
                            ? new Date(endDate)
                            : new Date()
                    }
                    mode={"date"}
                    display="default"
                    onChange={
                        handleEndDateChange
                    }
                />
            )}

            {/* END TIME */}

            {showEndTime && (

                <DateTimePicker
                    value={
                        endDate
                            ? new Date(endDate)
                            : new Date()
                    }
                    mode={"time"}
                    is24Hour
                    display="default"
                    onChange={
                        handleEndTimeChange
                    }
                />
            )}

            {/* SUBMIT */}

            <TouchableOpacity
                disabled={loading}
                onPress={handleSubmit(onSubmit)}
                activeOpacity={0.85}
                style={[
                    styles.button,
                    loading &&
                    styles.buttonDisabled
                ]}
            >

                <Text style={styles.buttonText}>

                    {loading
                        ? "Creating..."
                        : "Create Booking"}

                </Text>

            </TouchableOpacity>
        </View>
    )
}