import { getCategories } from "@/api/categories"
import { updateResource } from "@/api/resources"
import { useAuth } from "@/context/AuthContext"
import ResourceFormFields from "@/components/Resource/ResourceForm"
import { useLocationForm } from "@shared/hooks/useLocationForm"
import type { CategoryDto } from "@shared/types/category"
import { PaymentFor, type CreateResourceDto, type ResourceDto } from "@shared/types/resource"

import React, { useEffect, useState } from "react"

type Props = {
    resource: ResourceDto
}

export default function UpdateResource({resource}: Props){

    const { user } = useAuth()
    const [categories, setCategories] = useState<CategoryDto[]>([])
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState<CreateResourceDto>({
            name: resource.name,
            description: resource.description,
            price: resource.price,
            capacity: resource.capacity,
            location: resource.location,
            category_id: 1,
            auto_approved: false,
            payment_for:
                resource.payment_for ||
                PaymentFor.Day
        })

    const locationForm = useLocationForm(form.location)

    useEffect(() => {
        setForm(prev => ({
            ...prev,
            location:
                locationForm.location
        }))

    }, [locationForm.location])

    useEffect(() => {
        const load = async () => {
            const data = await getCategories()
            setCategories(data)

            const category = data.find(c => c.name === resource.category)
            if(category){
                setForm(prev => ({
                    ...prev,
                    category_id:
                        category.id
                }))
            }
        }

        load()

    }, [])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, type, value} = e.target
        setForm(prev => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? ( e.target as HTMLInputElement ).checked
                    : value
        }))
    }

    const validate = () => {
        if(form.name.length < 3){
            return ( "Name must contain at least 3 characters")
        }

        if(form.price <= 0){
            return ("Price must be greater than 0")
        }

        return null
    }

    const handleSubmit = async ( e: React.FormEvent ) => {
        e.preventDefault()
        const validationError = validate()

        if(validationError){
            setError(validationError)
            return
        }

        try {
            setError(null)
            if( user?.id !== resource.user_id){
                return
            }

            await updateResource(
                resource.id,
                {
                    ...form,
                    price: Number(form.price),
                    capacity: Number(form.capacity),
                    category_id: Number(form.category_id)
                }
            )

            window.location.reload()

        } catch {
            setError("Failed to update resource")
        }
    }

    return (
        <div className="form-container">

            <div className="form-card">

                <form
                    className="form"
                    onSubmit={handleSubmit}
                >

                    {error && (
                        <p className="form-error">
                            {error}
                        </p>
                    )}

                    <ResourceFormFields
                        form={form}
                        setForm={setForm}

                        categories={categories}
                        countries={locationForm.countries}
                        cities={locationForm.cities}
                        country={locationForm.country}
                        city={locationForm.city}
                        selectCountry={locationForm.selectCountry}
                        selectCity={locationForm.selectCity}

                        handleChange={handleChange}
                    />

                    <button className="btn-primary">
                        Update resource
                    </button>

                </form>

            </div>

        </div>
    )
}