import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { CreateResourceDto } from "../../../../shared/types/resource";
import { createResource } from "../../api/resources";
import type { CategoryDto } from "../../../../shared/types/category";
import { getCategories } from "../../api/categories";

export default function ResourceForm(){

    const navigator = useNavigate()

    const [categories, setCategories] = useState<CategoryDto[]>([])

    useEffect(() =>{
        getCategories().then(setCategories)
    }, [])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState<CreateResourceDto>({
        name: "",
        description: "",
        price: 0,
        capacity: 0,
        location: "",
        category_id: 1
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
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
            setLoading(true)
            setError(null)

            const resource = await createResource({
                ...form,
                price: Number(form.price),
                capacity: Number(form.capacity),
                category_id: Number(form.category_id)
            })
            navigator(`/resources/${resource.id}`)

        } catch (err) {
            setError("Failed to create resource")
        }finally{
            setLoading(false)
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

                <button 
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create resource"}
                </button>

                </form>

            </div>
        </div>
    )

}