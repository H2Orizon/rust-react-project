import { useEffect, useState } from "react";
import ResourceCard from "../Resource/ResourceCard";
import { getResources } from "@api/resources";
import type { PaginatedResponseResource, ResourceQuery } from "@shared/types/resource";
import type { CategoryDto } from "@shared/types/category";
import { getCategories } from "@/api/categories";

type Props = {
    userId: number
}

export default function UserResources({userId}: Props) {

    const [userResources, setUserResorces] = useState<PaginatedResponseResource>()
    const [categories, setCategories] = useState<CategoryDto[]>([])
    const [resourceQuery, setQuery] = useState<ResourceQuery>({
        user_id: userId,
        resource_name: undefined,
        category: undefined,
        per_page: 10,
        page: 1
    })

    const totalPage = userResources?.total_pages || 0
    const currentPage = userResources?.page || 0
    const per_page = userResources?.per_page || 0
    const resources = userResources?.resources || []

    useEffect(() => {
        if (!userId) return
        const timeout = setTimeout(() =>{
            return () => clearTimeout(timeout)
        }, 300)

        
        getResources(resourceQuery).then(setUserResorces)
    }, [resourceQuery])

    useEffect(() => {
        getCategories().then(setCategories)
    }, [])

    const handlerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setQuery({
            ...resourceQuery,
            [e.target.name]: e.target.value
        })
    }

    const mousHandler = (e: React.MouseEvent<HTMLButtonElement>) =>{
        setQuery({
            ...resourceQuery,
            [e.currentTarget.name]: e.currentTarget.value
        })
    }
    return(
    <div className="user-resources-page">

        <div className="resources-header">
            <h2>User Resources</h2>
        </div>

        <div className="page-filter">

            <input
                type="text"
                value={resourceQuery.resource_name || ""}
                name="resource_name"
                onChange={handlerChange}
                placeholder="Search resource..."
            />

            <select
                value={resourceQuery.category || ""}
                name="category"
                onChange={handlerChange}
            >
                <option value="">All Categories</option>

                {categories.map(c => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>

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
        </div>

        <div className="card-grid">
            {Array.isArray(resources) &&
            resources.length > 0 ? (
                resources.map(r => (
                    <ResourceCard
                        key={r.id}
                        resource={r}
                    />
                ))
            ) : (
                <div className="empty-state">
                    No resources found
                </div>
            )}
        </div>

        <div className="pagination">

            <button
                className="pagination-arrow"
                value={currentPage - 1}
                onClick={mousHandler}
                disabled={currentPage === 1}
                name="page"
            >
                ←
            </button>

            {Array.from({length: totalPage}).map((_, p) => {

                const page = p + 1

                const shouldShow =
                    page === 1 ||
                    page === totalPage ||
                    (
                        page >= currentPage - 1 &&
                        page <= currentPage + 1
                    )

                if (!shouldShow){

                    if(
                        page === currentPage - 2 ||
                        page === currentPage + 2
                    ){
                        return (
                            <span
                                key={page}
                                className="pagination-dots"
                            >
                                ...
                            </span>
                        )
                    }

                    return null
                }

                return(
                    <button
                        key={page}
                        className={
                            currentPage === page
                                ? "pagination-btn active"
                                : "pagination-btn"
                        }
                        name="page"
                        value={page}
                        onClick={mousHandler}
                    >
                        {page}
                    </button>
                )
            })}

            <button
                className="pagination-arrow"
                value={currentPage + 1}
                onClick={mousHandler}
                disabled={currentPage === totalPage}
                name="page"
            >
                →
            </button>

        </div>
    </div>
    )
}