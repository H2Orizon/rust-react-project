use rocket::{State, http::Status, serde::json::Json};
use sea_orm::DatabaseConnection;

use crate::{models::user_model::{CreateUser, LoginUserForm, UserDto}, services::user_service};


#[post("/login", data="<form>")]
pub async fn login(db: &State<DatabaseConnection>, form:Json<LoginUserForm>) -> Result<Json<String>, String>{
    match user_service::login(db, form.into_inner()).await {
        Ok(token) => Ok(Json(token)),
        Err(e) => Err(e.to_string())
    }
}

#[post("/register", data="<form>")]
pub async fn register(db: &State<DatabaseConnection>, form:Json<CreateUser>) -> Result<Json<UserDto>, Status>{
    match user_service::create_user(db, form.into_inner()).await {
        Ok(user) => Ok(Json(user)),
        Err(_) => Err(Status::InternalServerError)
    }
}

#[get("/<id>")]
pub async fn get_profile(db: &State<DatabaseConnection>, id: i32) -> Result<Json<UserDto>, Status> {
    match user_service::get_user(db, id).await {
        Ok(user) => Ok(Json(user)),
        Err(_) => Err(Status::InternalServerError)
    }
}