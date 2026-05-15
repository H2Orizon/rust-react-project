use std::{collections::HashMap, env};

use chrono::{ DateTime, Utc};
use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait, FromQueryResult, Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, prelude::Expr};
use validator::Validate;

use crate::{enums::{app_error::AppError, booking_status::BookingStatus}, models::{booking_model::{ActiveModel, BookingDto, BookingQuery, Column, CreateBooking, Entity, Model, PaginatedResponseBooking}, resource_model, user_model}, services::{resources_service, user_service}, utility};

#[derive(FromQueryResult)]
struct SumResult {
    total: Option<i64>,
}

async fn overlapping_bookings(db: &DatabaseConnection,resource_id: i32,dto: &CreateBooking) -> Result<i32, AppError> {

    let result: Option<SumResult> = Entity::find()
        .select_only()
        .column_as(Column::Quantity.sum(), "total")
        .filter(Column::ResourceId.eq(resource_id))
        .filter(Column::Status.eq(BookingStatus::Approved))
        .filter(Column::StartDate.lt(dto.end_date))
        .filter(Column::EndDate.gt(dto.start_date))
        .into_model::<SumResult>()
        .one(db)
        .await?;

    Ok(result.and_then(|r| r.total).unwrap_or(0) as i32)
}

async fn is_available(db: &DatabaseConnection, resource_id: i32, dto: &CreateBooking) -> Result<bool, AppError> {
    let resource = resources_service::get_one_model(db, resource_id).await?;
    let booked_now = overlapping_bookings(db, resource_id, dto).await?;
    let available = resource.capacity - booked_now;
    Ok(available >= dto.quantity.unwrap_or(1))
}

async fn get_one_model(db: &DatabaseConnection,id: i32) -> Result<Model, AppError>{
    let booking = Entity::find_by_id(id).one(db).await?
    .ok_or(AppError::BookingNotFound())?;

    Ok(booking)
}

//add enail massage
pub async fn auto_upadate_status(db: &DatabaseConnection){
    let now = Utc::now().naive_utc();

   match Entity::update_many()
    .col_expr(
        Column::Status, 
        Expr::case(
            Expr::col(Column::EndDate).lte(now)
                .and(Expr::col(Column::Status).eq(BookingStatus::Approved)),
            Expr::value(BookingStatus::Completed),
        ).case(
            Expr::col(Column::StartDate).lte(now)
                .and(Expr::col(Column::Status).eq(BookingStatus::Pending)),
            Expr::value(BookingStatus::Rejected),
        )
        .finally(Expr::col(Column::Status))
        .into(),
    )
    .exec(db)
    .await {
        Ok(res) => println!("Update bookings: {} time now: {}",res.rows_affected, now),
        Err(e) => eprintln!("Error autoupdate: {e:?}"),
    }
}

pub async fn get_resource_booked(db: &DatabaseConnection, resource_id: i32) -> Result<i32, AppError>{
    let booked = Entity::find()
                .filter(Column::ResourceId.eq(resource_id))
                .filter(Column::Status.eq(BookingStatus::Approved))
                .all(db).await?.iter().map(|b| b.quantity).sum();
    Ok(booked)
}

//need fix
pub async fn get_booking_map(db: &DatabaseConnection, resource_ids: &[i32]) -> Result<HashMap<i32, i32>, AppError> {
    
    let rows = Entity::find()
        .select_only()
        .column(Column::ResourceId)
        .expr_as(
            Expr::col(Column::Quantity).sum(),
            "total"
        )
        .filter(Column::ResourceId.is_in(resource_ids.to_vec()))
        .filter(Column::Status.eq(BookingStatus::Approved))
        .group_by(Column::ResourceId)
        .into_tuple::<(i32, Option<i64>)>()
        .all(db)
        .await?;

        let mut map = HashMap::new();
        for (resource_id, total) in rows{
            map.insert(resource_id, total.unwrap_or(0) as i32);
        }

        Ok(map)

}

//need fix
pub async fn get_next_availeble(db: &DatabaseConnection, resource_id: i32) -> Result<Option<DateTime<Utc>>, AppError>{
    let next_available = Entity::find()
        .filter(Column::ResourceId.eq(resource_id))
        .filter(Column::EndDate.gt(Utc::now()))
        .select_only()
        .column_as(Column::EndDate, "next_available_at")
        .order_by_asc(Column::EndDate)
        .into_tuple::<DateTime<Utc>>()
        .one(db)
        .await?;
    print!("next_available: {:?}",next_available);
    Ok(next_available)
}

pub async fn get_all_booking(db: &DatabaseConnection, query_patam: BookingQuery) -> Result<PaginatedResponseBooking, sea_orm::DbErr>{
    let mut query = Entity::find()
        .order_by(Column::StartDate, Order::Desc)
        .find_also_related(user_model::Entity)
        .find_also_related(resource_model::Entity);

    if let Some(user_id) = query_patam.user_id{
        query = query.filter(Column::UserId.eq(user_id))
    }

    if let Some(status) = query_patam.status{
        query = query.filter(Column::Status.eq(status))
    }

    if let Some(lessor_id) = query_patam.lessor_id{
        query = query.filter(resource_model::Column::UserId.eq(lessor_id))
    }

    if let Some(resource_name) = query_patam.resource_name{
        query = query.filter(resource_model::Column::Name.contains(resource_name))
    }

    let page = query_patam.page.unwrap_or(1).max(1);

    let per_page = query_patam.per_page.unwrap_or(10).clamp(1, 100);

    let paginateor = query.paginate(db, per_page);

    let total = paginateor.num_items().await?;
    let total_page = paginateor.num_pages().await?;

    let bookings = paginateor.fetch_page(page-1).await?;

    let mut dtos = Vec::new();

    for (booking, user, resource) in bookings {

        let u = user.unwrap();
        let r = resource.unwrap();

        dtos.push(BookingDto{
            id: booking.id,
            username: u.username,
            user_id: u.id,
            resource_name: r.name,
            lessor_id: r.user_id,
            resource_id: booking.resource_id,
            quantity: booking.quantity,
            location: booking.location,
            start_date: booking.start_date.and_utc(),
            end_date: booking.end_date.and_utc(),
            status: booking.status,
            created_at: booking.created_at.and_utc()
        });
    }

    Ok(PaginatedResponseBooking{
        bookings: dtos,
        total: total,
        page: page,
        per_page: per_page,
        total_pages: total_page
    })

}

pub async fn get_booking(db: &DatabaseConnection, id: i32) -> Result<BookingDto, AppError>{
    
    let booking = get_one_model(db, id).await?;


    let username: String;
    let user_id: i32;
    if let Some(user) = user_model::Entity::find_by_id(booking.user_id).one(db).await? {
        username = user.username;
        user_id = user.id;
    }else {
        return Err(AppError::UserNotFound());
    }

    let resource_name: String;
    let lessor_id: i32;
    if let Some(resource) = resource_model::Entity::find_by_id(booking.resource_id).one(db).await? {
        resource_name = resource.name;
        lessor_id = resource.user_id;
    }else {
        return Err(AppError::BookingNotFound());
    }

    Ok(BookingDto { 
        id: booking.id, 
        username: username, 
        user_id: user_id,
        resource_name: resource_name,
        lessor_id: lessor_id,
        resource_id: booking.resource_id,
        quantity: booking.quantity,
        location: booking.location,
        start_date: booking.start_date.and_utc(),
        end_date: booking.end_date.and_utc(),
        status: booking.status, 
        created_at: booking.created_at.and_utc()
    })

}

pub async fn create_booking(db: &DatabaseConnection, dto:CreateBooking) -> Result<Model, AppError>{
    dto.validate().map_err(|e| AppError::Validation(e.to_string()))?;

    if !is_available(db, dto.resource_id, &dto).await? {
        return Err(AppError::ResourceNotAvailable());
    }

    let resource = resources_service::get_one(db, dto.resource_id).await?;
    let mut status = BookingStatus::Pending;
    if resource.auto_approved{
        status = BookingStatus::Approved
    };

    let new_booking = ActiveModel {
        user_id: Set(dto.user_id),
        resource_id: Set(dto.resource_id),
        start_date: Set(dto.start_date.naive_utc()),
        location: Set(dto.location),
        end_date: Set(dto.end_date.naive_utc()),
        quantity: Set(dto.quantity.unwrap_or(1)),
        status: Set(status),
        ..Default::default()
    };

    let booking = new_booking.insert(db).await?;

    let renter = user_service::get_user(db, dto.user_id).await?;
    let owner = user_service::get_user(db, resource.user_id).await?;

    let html = utility::email_sender::render_resource_rented_template(
            &owner.username, 
            &resource.name, 
            &renter.username,
            &dto.start_date.to_string(),
            &dto.end_date.to_string()
        )?;

    let email = env::var("EMAIL").expect("Email No Found");

    utility::email_sender::send_email(
        &email,
        &owner.email,
        "New Booking",
        &html
    ).await?;

    Ok(booking)
}

pub async fn update_status(db: &DatabaseConnection, id: i32, status: BookingStatus) -> Result<Model, AppError> {
    
    let mut booking:ActiveModel = get_one_model(db, id).await?.into();

    booking.status = Set(status);

    let booking = booking.update(db).await?;

    Ok(booking)

}
