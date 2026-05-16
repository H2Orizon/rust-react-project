import { useAuth } from "@/context/AuthContext"
import CreateCategory from "../components/Admin/CreateCategory"
import UpdateCategory from "../components/Admin/UpdateCategory"

import { useNavigate } from "react-router"
import { useEffect, useState } from "react"

import type { CategoryDto } from "@shared/types/category"

import { getCategories } from "@/api/categories"

export default function AdminPanel() {

    const { user } = useAuth()

    const navigation = useNavigate()

    const [categories, setCategories] =
        useState<CategoryDto[]>([])

    const [selectedCategory,
        setSelectedCategory] =
            useState<CategoryDto | null>(null)

    const [showModal, setShowModal] =
        useState(false)

    if (
        user &&
        user.role.toLowerCase() !== "admin"
    ) {
        navigation("/")
    }

    const loadCategories = async () => {

        const data = await getCategories()

        setCategories(data)
    }

    useEffect(() => {
        loadCategories()
    }, [])

    return (

    <div className="page-container admin-page">

        <div className="admin-header">

            <div>

                <h1 className="admin-title">
                    Admin Panel
                </h1>

                <p className="admin-subtitle">
                    Manage categories and system data
                </p>

            </div>

        </div>

        <div className="admin-table-card">

            <div className="admin-table-wrapper">

                <table className="admin-table">

                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Movable</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {Array.isArray(categories) &&
                        categories.length > 0 ? (

                            categories.map((c) => (
                                <tr key={c.id}>

                                    <td className="category-id">
                                        #{c.id}
                                    </td>

                                    <td>
                                        <div className="category-name">
                                            {c.name}
                                        </div>
                                    </td>

                                    <td className="category-description">
                                        {c.description}
                                    </td>

                                    <td>
                                        <div
                                            className={`category-badge ${
                                                c.is_movable
                                                    ? "movable"
                                                    : "static"
                                            }`}
                                        >
                                            {c.is_movable
                                                ? "Movable"
                                                : "Static"}
                                        </div>
                                    </td>

                                    <td>

                                        <div className="table-actions">

                                            <button
                                                className="table-btn update"
                                                onClick={() => {
                                                    setSelectedCategory(c)
                                                    setShowModal(true)
                                                }}
                                            >
                                                Update
                                            </button>

                                            <button
                                                className="table-btn delete"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            ))

                        ) : (

                            <tr>
                                <td colSpan={5}>

                                    <div className="admin-empty">

                                        <h3>
                                            No Categories
                                        </h3>

                                        <p>
                                            Create your first category
                                        </p>

                                    </div>

                                </td>
                            </tr>
                        )}

                    </tbody>

                </table>

            </div>

        </div>

        <div className="admin-create-section">
            <CreateCategory />
        </div>

            {showModal && selectedCategory && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowModal(false)
                    }
                >

                    <div
                        className="modal-window"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <h2>
                                Update Category
                            </h2>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                ✕
                            </button>

                        </div>

                        <UpdateCategory
                            category={selectedCategory}
                        />

                    </div>

                </div>
            )}

        </div>
    )
}