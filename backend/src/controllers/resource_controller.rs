use rocket::{State, http::Status, serde::json::Json};
use sea_orm::DatabaseConnection;

use crate::{auth::guard::AuthUser, models::resource_model::{CreateResource, Model, ResourceListDto, ResourceDto, ResourceQuery, UpdateResource}, services::resources_service};

#[get("/?<query..>")]
pub async fn get_all_resources(db: &State<DatabaseConnection>, query: ResourceQuery) -> Result<Json<Vec<ResourceListDto>>, String>{
    match resources_service::get_all(db, query).await {
        Ok(resources) => Ok(Json(resources)),
        Err(e) => Err(e.to_string())
    }
}

#[post("/", data="<dto>")]
pub async fn create_resources(db: &State<DatabaseConnection>, dto: Json<CreateResource>, user: AuthUser) -> Result<Json<Model>, Status>{
    if user.id == 0{
        return Err(Status::NonAuthoritativeInformation);
    }

    match resources_service::create(db, dto.into_inner(), user).await {
        Ok(resource) => Ok(Json(resource)),
        Err(_) => Err(Status::InternalServerError)
    }
}

#[get("/<id>")]
pub async fn get_one_resource(db: &State<DatabaseConnection>, id:i32) -> Result<Json<ResourceDto>, Status>{
    match resources_service::get_one(db, id).await {
        Ok(resource) => Ok(Json(resource)),
        Err(_) => Err(Status::NotFound)
    }
}

#[patch("/<id>", data="<update_dto>")]
pub async fn update_resource(db: &State<DatabaseConnection>, id:i32, update_dto: Json<UpdateResource>, user: AuthUser) -> Result<Json<Model>, Status>{
        if user.id == 0{
        return Err(Status::NonAuthoritativeInformation);
    }
    
    match resources_service::update(db, id, update_dto.into_inner()).await {
        Ok(updated) => Ok(Json(updated)),
        Err(_) => Err(Status::NotFound)
    }
}

#[delete("/<id>")]
pub async fn delete_resource(db: &State<DatabaseConnection>, id:i32, user: AuthUser) -> Status{

    if user.id == 0 {
        return Status::NonAuthoritativeInformation;
    }

    let resource_user_id = match resources_service::get_one_model(db, id).await {
        Ok(resource) => resource.user_id,
        Err(_) => return Status::NotFound
    };

    if user.id != resource_user_id {
        return Status::Forbidden;
    }


    match resources_service::delete(db, id).await {
        Ok(_) => Status::NoContent,
        Err(_) => Status::NotFound
    }
}