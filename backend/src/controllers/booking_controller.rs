use rocket::{State, http::Status, serde::json::Json};
use sea_orm::DatabaseConnection;

use crate::{auth::guard::AuthUser, models::booking_model::{BookingDto, CreateBooking, Model}, services::booking_service};

#[get("/")]
pub async fn get_all_booking(db: &State<DatabaseConnection>) -> Result<Json<Vec<BookingDto>>, Status>{
    match booking_service::get_all_booking(db).await {
        Ok(bookings) => Ok(Json(bookings)),
        Err(_) => Err(Status::NotFound)
    }
}

#[get("/<id>")]
pub async fn get_booking(db: &State<DatabaseConnection>, id: i32) -> Result<Json<BookingDto>, Status>{
    match booking_service::get_booking(db, id).await {
        Ok(booking) => Ok(Json(booking)),
        Err(_) => Err(Status::NotFound)
    }
}

#[post("/<resource_id>", data="<dto>")]
pub async fn create_booking(db: &State<DatabaseConnection>, dto: Json<CreateBooking>, resource_id: i32, user: AuthUser) -> Result<Json<Model>, Status>{
    match booking_service::create_booking(db, resource_id, user.id, dto.into_inner()).await {
        Ok(booking) => Ok(Json(booking)),
        Err(_) => Err(Status::BadRequest),
    }
}
