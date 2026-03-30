use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait, PaginatorTrait, QueryFilter};
use validator::Validate;

use crate::{enums::booking_status::BookingStatus, models::{booking_model::{ActiveModel, BookingDto, BookingQuery, Column, CreateBooking, Entity, Model}, resource_model, user_model}, services::resources_service};

async fn overlapping_bookings(db: &DatabaseConnection,resource_id: i32,dto: &CreateBooking) -> Result<i32, sea_orm::DbErr> {

    let count = Entity::find()
        .filter(Column::ResourceId.eq(resource_id))
        .filter(
            sea_orm::Condition::any()
                .add(Column::Status.eq(BookingStatus::Approved))
                .add(Column::Status.eq(BookingStatus::Pending)),
        )
        .filter(Column::StartDate.lt(dto.end_date))
        .filter(Column::EndDate.gt(dto.start_date))
        .count(db)
        .await?;

    Ok(count as i32)
}

async fn is_available(db: &DatabaseConnection, resource_id: i32, dto: &CreateBooking) -> Result<bool, sea_orm::DbErr> {
    let resource = resources_service::get_one_model(db, resource_id).await?;
    let booked_now = overlapping_bookings(db, resource_id, dto).await?;
    let available = resource.capacity - booked_now;
    Ok(available >= dto.quantity.unwrap_or(1))
}

async fn get_one_model(db: &DatabaseConnection,id: i32) -> Result<Model, sea_orm::DbErr>{
    let booking = Entity::find_by_id(id).one(db).await?
    .ok_or(sea_orm::DbErr::RecordNotFound("Booking not found".to_string()))?;

    Ok(booking)
}


pub async fn get_all_booking(db: &DatabaseConnection, query_patam: BookingQuery) -> Result<Vec<BookingDto>, sea_orm::DbErr>{
    let mut query = Entity::find()
        .find_also_related(user_model::Entity)
        .find_also_related(resource_model::Entity);

    if let Some(user_id) = query_patam.user_id{
        query = query.filter(Column::UserId.eq(user_id))
    }


    let bookings = query.all(db).await?;

    let mut dtos = Vec::new();

    for (booking, user, resource) in bookings {

        dtos.push(BookingDto{
            id: booking.id,
            username: user.map(|u| u.username).unwrap_or("Unknowm".into()),
            resource_name: resource.map(|r| r.name).unwrap_or("Unknowm".into()),
            quantity: booking.quantity,
            location: booking.location,
            start_date: booking.start_date,
            end_date: booking.end_date,
            status: booking.status,
            created_at: booking.created_at
        });
    }

    Ok(dtos)

}

pub async fn get_booking(db: &DatabaseConnection, id: i32) -> Result<BookingDto, sea_orm::DbErr>{
    
    let booking = get_one_model(db, id).await?;

    let username = user_model::Entity::find_by_id(booking.user_id).one(db).await?
    .ok_or(sea_orm::DbErr::RecordNotFound("User not found".to_string()))?.username;

    let resource_name = resource_model::Entity::find_by_id(booking.resource_id).one(db).await?
    .ok_or(sea_orm::DbErr::RecordNotFound("Resource not found".to_string()))?.name;

    Ok(BookingDto { 
        id: booking.id, 
        username: username, 
        resource_name: resource_name, 
        quantity: booking.quantity, 
        location: booking.location, 
        start_date: booking.start_date, 
        end_date: booking.end_date, 
        status: booking.status, 
        created_at: booking.created_at 
    })

}

pub async fn create_booking(db: &DatabaseConnection, dto:CreateBooking) -> Result<Model, sea_orm::DbErr>{
    dto.validate().map_err(|e| sea_orm::DbErr::Custom(e.to_string()))?;

    if !is_available(db, dto.resource_id, &dto).await? {
        return Err(sea_orm::DbErr::Custom(
            "Resource is not available for selected time".into(),
        ));
    }

    let new_booking = ActiveModel {
        user_id: Set(dto.user_id),
        resource_id: Set(dto.resource_id),
        start_date: Set(dto.start_date),
        end_date: Set(dto.end_date),
        quantity: Set(dto.quantity.unwrap_or(1)),
        status: Set(BookingStatus::Pending),
        ..Default::default()
    };

    new_booking.insert(db).await
}

pub async fn update_status(db: &DatabaseConnection, id: i32, status: BookingStatus) -> Result<Model, sea_orm::DbErr> {
    
    let mut booking:ActiveModel = get_one_model(db, id).await?.into();

    booking.status = Set(status);

    let booking = booking.update(db).await?;

    Ok(booking)

}
