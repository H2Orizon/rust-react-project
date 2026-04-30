import React, { useState } from "react";
import type { CreateCategoryDto } from "../../../../shared/types/category";
import { createCategory } from "../../api/categories";
export default function CreateCategory() {

    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState<CreateCategoryDto>({
        name: "",
        description: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const validate = () => {
        if (form.name.length < 3) {
            return "Name must contain at least 3 characters"
        }
        return null
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()

        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return
        }

        try {
            setError(null)

            await createCategory({ ...form })

        } catch (error) {
            setError("Failed to create resource")
        }

    }

    return(
    <div className="form-container">
        <div className="form-card">

            <form className="form" onSubmit={handleSubmit}>

                <h2>Create Category</h2>

                {error && <p className="form-error">{error}</p>}

                <input 
                    name="name"
                    placeholder="Category name"
                    value={form.name}
                    onChange={handleChange}
                />

                <textarea 
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                />

                <button className="btn-primary" type="submit">
                    Create
                </button>

            </form>

        </div>
    </div>
    )

}