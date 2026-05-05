import { useEffect, useState } from "react";
import ResourceCard from "../../components/Resource/ResourceCard";
import { Link } from "react-router-dom";
import type { ResourceListDto, ResourceQuery } from "../../../../shared/types/resource";
import { getResources } from "../../api/resources";
import type { CategoryDto } from "../../../../shared/types/category";
import { getCategories } from "../../api/categories";
// import { Slider } from "@mui/material";

export default function Resources() {
    const [resources, setResources] = useState<ResourceListDto[]>([])
    const [categories, setCategories] = useState<CategoryDto[]>([])
    const [query, setQuery] = useState<ResourceQuery>({
         resource_name: undefined,
         category: undefined,
         min_price: undefined,
         max_price: undefined
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement >) => {
        setQuery({
            ...query,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() =>{
        getResources(query).then(setResources)
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
                    onChange={handleChange}
                    placeholder="Resource name"
                />
                <select value={query.category || ""} name="category" onChange={handleChange}>
                    <option value="" disabled>All categories</option>
                    <option value={undefined}>All</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                    <input 
                        min={0} 
                        max={Number(query.max_price)-10} 
                        type="number" 
                        name="min_price" 
                        value={query.min_price|| ""} 
                        onChange={handleChange}
                        placeholder="min price"
                    />
                    <input 
                        min={Number(query.min_price)+10} 
                        max={10000000} 
                        type="number" 
                        name="max_price" 
                        value={query.max_price || ""} 
                        onChange={handleChange}
                        placeholder="max price"
                    />
                    
                    {/* To DO
                    <div className="range-slider">
                        <Slider 
                            min={5}
                            max={1000000}
                            getAriaLabel={() => 'Minimum distance shift'}
                            value={queru.price}
                            // onChange={handleChange}
                            valueLabelDisplay="auto"
                            // getAriaValueText={}
                            disableSwap
                        />
                        {queru.price}
                    </div> */}
            </div>

            <div className="card-grid">
                {Array.isArray(resources) && resources.map(r => (
                    <ResourceCard key={r.id} resource={r}/>
                ))}
            </div>

        </div>
    )
}