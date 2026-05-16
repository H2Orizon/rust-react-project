import { getCategories } from "@/api/categories"
import { updateResource } from "@/api/resources"
import { useAuth } from "@/context/AuthContext"
import type { CategoryDto } from "@shared/types/category"
import { PaymentFor, type CreateResourceDto, type ResourceDto } from "@shared/types/resource"
import { useEffect, useState } from "react"

type Props = {
    resource: ResourceDto
}

export default function UpdateResource({resource}: Props){
    const {user} = useAuth()
    
    const [categories, setCategories] = useState<CategoryDto[]>([])
    const category_id = categories.find((c) => (c.name === resource.category))?.id || 1

    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getCategories().then(setCategories)
    }, [])

    const [form, setForm] = useState<CreateResourceDto>({
        name: resource.name,
        description: resource.description,
        price: resource.price,
        capacity: resource.capacity,
        location: resource.location,
        category_id: category_id,
        auto_approve: false,
        payment_for: PaymentFor.Day
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const {name, type, value} = e.target

        setForm({
            ...form,
            [name]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value
        })
    }

    const validate = () => {
        if(form.name.length < 3){
            return "Name must contain at least 3 characters"
        }
        if (form.price <= 0) {
            return "Price must be greater than 0"
        }
        return null
    }

        const handleSubmit = async (e: React.SubmitEvent) => {
            e.preventDefault()
    
            const validationError = validate()
            if (validationError){
                setError(validationError)
                return
            }
    
        try {
            setError(null)
            if (user?.id !== resource.user_id) return

            await updateResource(resource.id, {
                ...form,
                price: Number(form.price),
                capacity: Number(form.capacity),
                category_id: Number(form.category_id)
            })
            window.location.reload()

        } catch (err) {
            setError("Failed to create resource")
        }
    }
        return (
        <div className="form-container">
            <div className="form-card">

                <form className="form" onSubmit={handleSubmit}>

                {error && <p className="form-error">{error}</p>}

                <input
                    name="name"
                    placeholder="Resource name"
                    value={form.name}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                />

                <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={form.capacity}
                    onChange={handleChange}
                />

                <input
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                />

                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                    >
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="payment_for"
                        value={form.payment_for}
                        onChange={handleChange}
                    >
                        {Object.values(PaymentFor).map((p) =>
                            <option key={p} value={p}>
                                {p}
                            </option>
                        )}
                    </select>

                <span>
                    Autho approve?:
                <input type="checkbox" name="auto_approve" onChange={handleChange}/>
                </span>
                <button className="btn-primary">
                    "Update resource"
                </button>

                </form>

            </div>
        </div>
    )
}