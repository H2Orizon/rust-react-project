import React, { useEffect, useState } from "react";
import ResourceCard from "../../components/Resource/ResourceCard";
import { Link } from "react-router-dom";
import type { PaginatedResponse, ResourceQuery } from "../../../../shared/types/resource";
import { getResources } from "../../api/resources";
import type { CategoryDto } from "../../../../shared/types/category";
import { getCategories } from "../../api/categories";
// import { Slider } from "@mui/material";

export default function Resources() {
    const [data, setData] = useState<PaginatedResponse>()
    const [categories, setCategories] = useState<CategoryDto[]>([])
    const [query, setQuery] = useState<ResourceQuery>({
         resource_name: undefined,
         category: undefined,
         min_price: undefined,
         max_price: undefined,
         per_page: 10,
         page: 1
    })

    const totalPage = data?.total_pages || 0
    const currentPage = data?.page || 0
    const per_page = data?.per_page || 0


    const handlerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setQuery({
            ...query,
            [e.target.name]: e.target.value
        })
    }

    const mousHandler = (e: React.MouseEvent<HTMLButtonElement>) =>{
        setQuery({
            ...query,
            [e.currentTarget.name]: e.currentTarget.value
        })
    }

    useEffect(() =>{
        const timeout = setTimeout(() =>{
            return () => clearTimeout(timeout)
        }, 300)
        getResources(query).then(setData)
    }, [query])

    useEffect(() => {
        getCategories().then(setCategories)
    }, [])

    return(
        <div className="page-container">

            <div className="page-header">
                <h1>Resources</h1>
                <div className="page-actions">
                    <Link to="/resources/create">
                        <button className="btn-primary">
                            Create Resource
                        </button>
                    </Link>

                    <Link to="/category/create">
                        <button className="btn-outline">
                            Create Category
                        </button>
                    </Link>
                </div>
            </div>

            <div className="page-filter">

                <input
                    type="text"
                    value={query.resource_name}
                    name="resource_name"
                    onChange={handlerChange}
                    placeholder="Search resource..."
                />

                <select
                    value={query.category || ""}
                    name="category"
                    onChange={handlerChange}
                >
                    <option value="">All categories</option>

                    {categories.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <input
                    min={0}
                    type="number"
                    name="min_price"
                    value={query.min_price || ""}
                    onChange={handlerChange}
                    placeholder="Min price"
                />

                <input
                    min={0}
                    type="number"
                    name="max_price"
                    value={query.max_price || ""}
                    onChange={handlerChange}
                    placeholder="Max price"
                />

                    {[1,10,20,30].map(num => (
                        <button
                            key={num}
                            value={num}
                            name="per_page"
                            onClick={mousHandler}
                            className={
                                per_page === num
                                    ? "active"
                                    : ""
                            }
                        >
                            {num}
                        </button>
                    ))}
            </div>

            <div className="card-grid">
                {Array.isArray(data?.resources) && data.resources.map(r => (
                    <ResourceCard key={r.id} resource={r}/>
                ))}
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
                {Array.from({length: totalPage}).map((_, p) => 
                    {
                        const page = p + 1
                        
                        const shouldShow =
                        page === 1 ||
                        page === totalPage ||
                        (page >= currentPage - 1 && page <= currentPage +1)

                        if (!shouldShow){
                            if(
                                page === currentPage - 2 ||
                                page === currentPage + 2
                            ) {
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

                    return (
                        <button
                            key={page}
                            className={`pagination-btn ${
                                currentPage === page ? "active" : ""
                            }`}
                            name="page"
                            value={page}
                            onClick={mousHandler}
                        >
                            {page}
                        </button>
                    )}
                )}

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