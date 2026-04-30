import { useEffect, useState } from "react";
import ResourceCard from "../../components/Resource/ResourceCard";
import { Link } from "react-router-dom";
import type { ResourceListDto } from "../../../../shared/types/resource";
import { getResources } from "../../api/resources";

export default function Resources() {
    const [resources, setResources] = useState<ResourceListDto[]>([])

    useEffect(() =>{
        getResources().then(setResources)
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

            <div className="card-grid">
                {Array.isArray(resources) && resources.map(r => (
                    <ResourceCard key={r.id} resource={r}/>
                ))}
            </div>

        </div>
    )
}