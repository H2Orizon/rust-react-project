import ResourceFormFields from "@/components/Resource/ResourceForm"
import { useEffect, useState } from "react"
import type { CategoryDto } from "@shared/types/category"
import { PaymentFor, type CreateResourceDto } from "@shared/types/resource"
import { useLocationForm } from "@shared/hooks/useLocationForm"
import { getCategories } from "@/api/categories"
import { createResource } from "@/api/resources"

export default function CreateResource() {
    
        const [categories, setCategories] = useState<CategoryDto[]>([])
        const [error, setError] = useState<string | null>(null)
    
        const [form, setForm] = useState<CreateResourceDto>({
                name: "",
                description: "",
                price: 0,
                capacity: 0,
                location: "",
                category_id: 1,
                auto_approved: false,
                payment_for: PaymentFor.Day
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
    
                await createResource({
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
    return(
        <div>
            <h1>Create Resourse</h1>
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
                    Create resource
                </button>
            </form>
        </div>    
    )
}