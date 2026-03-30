use rocket::{State, http::Status, serde::json::Json};
use sea_orm::DatabaseConnection;

use crate::{auth::guard::AuthUser, enums::booking_status::BookingStatus, models::booking_model::{BookingDto, BookingQuery, CreateBooking, Model}, services::booking_service};

#[get("/?<query..>")]
pub async fn get_all_booking(db: &State<DatabaseConnection>, query: BookingQuery) -> Result<Json<Vec<BookingDto>>, Status>{
    match booking_service::get_all_booking(db, query).await {
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

#[post("/", data="<dto>")]
pub async fn create_booking(db: &State<DatabaseConnection>, dto: Json<CreateBooking>, user: AuthUser) -> Result<Json<Model>, Status>{
    if user.id == 0{
        return Err(Status::NonAuthoritativeInformation);
    }

    match booking_service::create_booking(db, dto.into_inner()).await {
        Ok(booking) => Ok(Json(booking)),
        Err(_) => Err(Status::BadRequest),
    }
}

#[patch("/<resource_id>", data="<status>")]
pub async fn update_status(db: &State<DatabaseConnection>, resource_id: i32, status: Json<BookingStatus>) -> Status{
    match booking_service::update_status(db, resource_id, status.into_inner()).await {
        Ok(_) => Status::Ok,
        Err(_) => Status::InternalServerError
    }
}
