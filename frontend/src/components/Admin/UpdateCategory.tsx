import React, { useState } from "react";
import type { CategoryDto, CreateCategoryDto } from "@shared/types/category";
import { updateCategory } from "@api/categories";

type Props = {
    category: CategoryDto
}

export default function UpdateCategory({category}: Props) {

    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState<CreateCategoryDto>({
        name: category.name,
        description: category.description,
        is_movable: category.is_movable
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

            await updateCategory(form, category.id)

        } catch (error) {
            setError("Failed to create resource")
        }

    }

    return(
    <div className="form-container">
        <div className="form-card">

            <form className="form" onSubmit={handleSubmit}>

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

                <span>
                    Is Movable?:
                    <input type="checkbox" name="is_movable" onChange={handleChange}/>
                </span>

                <button className="btn-primary" type="submit">
                    Update
                </button>

            </form>

        </div>
    </div>
    )

}