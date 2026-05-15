use std::path::PathBuf;

use rocket::{State, form::Form, http::Status, serde::json::Json};
use sea_orm::DatabaseConnection;
use uuid::Uuid;

use crate::{auth::guard::AuthUser, models::{image_model::{self, UploadImage}, resource_model::{CreateResource, Model, PaginatedResponseResources, ResourceDto, ResourceQuery, UpdateResource}}, services::{image_service, resources_service}};

#[get("/?<query..>")]
pub async fn get_all_resources(db: &State<DatabaseConnection>, query: ResourceQuery) -> Result<Json<PaginatedResponseResources>, String>{
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

#[post("/<id>/image", data="<form>")]
pub async fn upload_image(db: &State<DatabaseConnection>, id:i32, mut form: Form<UploadImage<'_>>, user: AuthUser) -> Result<Json<image_model::Model>, Status>{
    if user.id == 0{
        return Err(Status::NonAuthoritativeInformation);
    }
    
    let extension  = form.file
        .raw_name()
        .and_then(|n| n.dangerous_unsafe_unsanitized_raw().as_str().split('.').last())
        .unwrap_or("jpg");

    if !is_allowed_image(extension){
        return Err(Status::BadRequest);
    }

        let upload_dir = PathBuf::from("./uploads/resources");

        std::fs::create_dir_all(&upload_dir)
            .map_err(|_| Status::InternalServerError)?;

        let file_name = format!("{}.{}", Uuid::new_v4(), extension);

        let full_path = upload_dir.join(&file_name);

        let db_path = format!("resources/{}", file_name);

        form.file
            .copy_to(&full_path)
            .await
            .map_err(|e| {
                println!("{:?}", e);
                Status::InternalServerError
        })?;

    let image = image_service::add_new_image(db, id, db_path)
        .await.map_err(|e| {println!("{:?}", e.to_string()); Status::InternalServerError})?;
    Ok(Json(image))
}

#[delete("/<id>/image/<img_id>")]
pub async fn delete_image(db: &State<DatabaseConnection>, id: i32, img_id: i32, user: AuthUser) -> Status {
    if user.id == 0 {
        return Status::NonAuthoritativeInformation;
    }

    let resource_user_id = match resources_service::get_one_model(db, id).await {
        Ok(resource) => resource.user_id,
        Err(_) => return Status::NotFound
    };

    if user.id != resource_user_id{
        return Status::Forbidden;
    }

    match image_service::delete_image(db, img_id).await {
        Ok(_) => Status::NoContent,
        Err(_) => Status::NotFound
    }
}

fn is_allowed_image(extension: &str) -> bool {
    matches!(
        extension.to_lowercase().as_str(),
        "jpg" | "jpeg" | "png" | "webp"
    )
}