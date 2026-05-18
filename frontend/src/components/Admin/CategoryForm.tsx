import type { CreateCategoryDto } from "@shared/types/category"
import type React from "react"

type Props = {
    form: CreateCategoryDto,
    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement | 
            HTMLSelectElement | 
            HTMLTextAreaElement
        >
    ) => void
}

export default function CategoryForm ({form, handleChange}: Props) {
    return(
        <>
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
        </>
    )
}