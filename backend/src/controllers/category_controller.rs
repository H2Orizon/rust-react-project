use rocket::{State, http::Status};
use rocket::serde::{json::Json};
use sea_orm::DatabaseConnection;

use crate::auth::guard::AuthUser;
use crate::enums::user_role::UserRole;
use crate::{models::category_model, services::category_service};

#[get("/")]
pub async fn get_all_categories(db: &State<DatabaseConnection>) -> Result<Json<Vec<category_model::Model>>, Status>{
    match category_service::get_all(db).await {
        Ok(categories) => Ok(Json(categories)),
        Err(_) => Err(Status::NotFound),
    }
}

#[post("/", data="<dto>")]
pub async fn create_category(db: &State<DatabaseConnection>, dto: Json<category_model::CreateCategory>, user: AuthUser) -> Result<Json<category_model::Model>, Status>{
    if user.role != UserRole::Admin {
        println!("Role?: {:?}", user.role);
        Err(Status::Forbidden)?;
    }
    match category_service::create(db, dto.into_inner()).await {
        Ok(category) => Ok(Json(category)),
        Err(_) => Err(Status::InternalServerError)
    }
}

#[get("/<id>")]
pub async fn get_category(db: &State<DatabaseConnection>, id:i32) -> Result<Json<category_model::Model>, Status>{
    match category_service::get_one(db, id).await {
        Ok(category) => Ok(Json(category)),
        Err(_) => Err(Status::NotFound)
    }
}
