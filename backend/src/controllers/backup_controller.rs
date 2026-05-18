use rocket::{http::Status, serde::json::Json};

use crate::{auth::guard::AuthUser, enums::user_role::UserRole, services::backup_service::{restore_backup, list_backups}};

#[get("/")]
pub async fn get_backups(user: AuthUser) -> Result<Json<Vec<String>>, Status>{
    if user.role != UserRole::Admin{
        return Err(Status::NonAuthoritativeInformation);
    }

    let list = list_backups().await;
    Ok(Json(list))
}

#[post("/<file>")]
pub async fn load_backups(user: AuthUser, file:String) -> Result<Status, Status>{
    if user.role != UserRole::Admin{
        return Err(Status::NonAuthoritativeInformation);
    }

    if file.contains("..") || file.contains("/") {
        return Err(Status::BadRequest);
    }

    match restore_backup(&file).await {
        Ok(_) => Ok(Status::Ok),
        Err(e) => {
            eprintln!("{}", e);
            Err(Status::InternalServerError)
        }
    }
}