import { useEffect, useState } from "react"
import type { UserDto } from "../../types/users"
import { useParams } from "react-router"
import { getProfile } from "../../api/users"
import UserResources from "../../components/User/UsersResources"

export default function UserProfile(){

    const {id} = useParams()

    const [userProfile, setUserProfile] = useState<UserDto>()

    useEffect(() =>{
        if (!id) return

        getProfile(Number(id)).then(setUserProfile)

    }, [id])

    if (!userProfile){
        return <div>Loading...</div>
    }

    return(
        <div>
            <div>
                <p>{userProfile.username}</p>
                <p>{userProfile.email}</p>
                <p>{userProfile.phone}</p>
                <p>{userProfile.city}</p>
                {userProfile.is_active ? (<p>Is active</p>) : (<p>Is disable</p>)}
                <p>
                    {new Date(userProfile.created_at)
                        .toLocaleDateString("en-US",{
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    )}
                </p>
            </div>
            <div>
                <div>
                    <UserResources userId={Number(id)}/>
                </div>
                <div>
                    <UserResources userId={Number(id)}/>
                </div>
            </div>
        </div>
    )
}