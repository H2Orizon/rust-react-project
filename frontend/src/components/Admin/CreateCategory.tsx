import React, { useState } from "react";
import type { CreateCategoryDto } from "@shared/types/category";
import { createCategory } from "@api/categories";
import CategoryForm from "@/components/Admin/CategoryForm"
import toast from "react-hot-toast";

export default function CreateCategory() {

    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState<CreateCategoryDto>({
        name: "",
        description: "",
        is_movable: false
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

            await createCategory({ ...form })

            toast.success("Category Created")

        } catch (error) {
            setError("Failed to create category")
        }

    }

    return(
    <div className="form-container">
        <div className="form-card">

            <form className="form" onSubmit={handleSubmit}>

                <h2>Create Category</h2>

                {error && <p className="form-error">{error}</p>}

                <CategoryForm 
                    form={form}
                    handleChange={handleChange}
                />

                <button className="btn-primary" type="submit">
                    Create
                </button>

            </form>

        </div>
    </div>
    )

}