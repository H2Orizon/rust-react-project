import { useAuth } from "@/context/AuthContext"
import CreateCategory from "../components/Admin/CreateCategory"
import UpdateCategory from "../components/Admin/UpdateCategory"

import { useNavigate } from "react-router"
import { useEffect, useState } from "react"

import type { CategoryDto, CategoryQuery, PaginatedCategory } from "@shared/types/category"
import { deleteCategory, getAllCategoryForAdmin} from "@/api/categories"

export default function AdminPanel() {

    const { user } = useAuth()

    const navigation = useNavigate()

    const [paginate, setPaginatedCategory] = useState<PaginatedCategory>()
    const [error, setError] = useState<string | null>(null)

    const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [query, setQuery] = useState<CategoryQuery>({
        name: undefined,
        description: undefined,
        is_movable: undefined,
        per_page: 10,
        page: 1
    })

    const [showModal, setShowModal] =
        useState(false)

    useEffect(() => {

        console.log(query)

        if (
            user &&
            user.role.toLowerCase() !== "admin"
        ) {
            navigation("/")
        }

        const timeout = setTimeout(() => {

            getAllCategoryForAdmin(query)
                .then(setPaginatedCategory)

        }, 300)

        return () => clearTimeout(timeout)

    }, [query ,user, navigation])

    const handlerChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {

        const { name, value } = e.target

        setQuery({
            ...query,
            [name]: value,
        })
    }

    const mousHandler = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {

        const { name, value } = e.currentTarget

        setQuery({
            ...query,
            [name]: Number(value),
        })
    }

    const delete_category = async (id: number) =>{
        if (user?.role.toLowerCase() !== "admin") navigation("/")

        try{
            await deleteCategory(id)
            setError(null)

        }catch{
            setError("Failed to delete category")
        }
    }

    const totalPage = paginate?.total_pages || 0
    const currentPage = paginate?.page || 0
    const per_page = paginate?.per_page || 0
    const categories = paginate?.categories || []

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

        <div className="page-filter">

                <input
                    type="text"
                    value={query.name || ""}
                    name="name"
                    onChange={handlerChange}
                    placeholder="Search category..."
                />

                <input
                    type="text"
                    name="description"
                    value={query.description || ""}
                    onChange={handlerChange}
                    placeholder="Description"
                />

                    {[1,10,20,30].map(num => (
                        <button
                            key={num}
                            value={num}
                            name="per_page"
                            onClick={mousHandler}
                            className={
                                `per-page-btn ${
                                    per_page === num
                                        ? "active"
                                        : ""
                                }`
                            }
                        >
                            {num}
                        </button>
                    ))}

                <select
                    name="is_movable"
                    value={
                        query.is_movable === undefined
                            ? ""
                            : String(query.is_movable)
                    }
                    onChange={(e) =>
                        setQuery({
                            ...query,
                            is_movable:
                                e.target.value === ""
                                    ? undefined
                                    : e.target.value === "true"
                        })
                    }
                >
                    <option value="">
                        All
                    </option>

                    <option value="true">
                        Movable
                    </option>

                    <option value="false">
                        Static
                    </option>
                </select>
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
                                                onClick={() => {
                                                    delete_category(c.id)
                                                }}
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

                <div className="pagination">

                    <button
                        className="pagination-btn"
                        disabled={currentPage <= 1}
                        onClick={() =>
                            setQuery(prev => ({
                                ...prev,
                                page: currentPage - 1
                            }))
                        }
                    >
                        Prev
                    </button>

                    {Array.from({ length: totalPage }, (_, i) => i + 1)
                        .map(pageNum => (

                            <button
                                key={pageNum}
                                className={
                                    `pagination-btn ${
                                        currentPage === pageNum
                                            ? "active"
                                            : ""
                                    }`
                                }
                                onClick={() =>
                                    setQuery(prev => ({
                                        ...prev,
                                        page: pageNum
                                    }))
                                }
                            >
                                {pageNum}
                            </button>
                        ))}

                    <button
                        className="pagination-btn"
                        disabled={currentPage >= totalPage}
                        onClick={() =>
                            setQuery(prev => ({
                                ...prev,
                                page: currentPage + 1
                            }))
                        }
                    >
                        Next
                    </button>

                </div>

            </div>

        </div>

            <div className="admin-create-section">

                <button
                    className="create-category-btn"
                    onClick={() =>
                        setShowCreateModal(true)
                    }
                >
                    Create Category
                </button>

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

            {showCreateModal && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowCreateModal(false)
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
                                Create Category
                            </h2>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowCreateModal(false)
                                }
                            >
                                ✕
                            </button>

                        </div>

                        <CreateCategory />

                    </div>

                </div>
            )}

        </div>
    )
}