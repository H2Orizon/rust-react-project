use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use validator::Validate;
use chrono::{DateTime, Utc, NaiveDateTime};

use crate::{enums::booking_status::BookingStatus, models::{resource_model, user_model}};

#[derive(Clone, Debug, DeriveEntityModel, PartialEq, Serialize, Deserialize)]
#[sea_orm(table_name="bookings")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub user_id: i32,
    pub resource_id: i32,
    pub quantity: i32,
    pub location: Option<String>,
    pub start_date: NaiveDateTime,
    pub end_date: NaiveDateTime,
    pub status: BookingStatus,
    pub created_at: NaiveDateTime
}

#[derive(Serialize, Deserialize)]
pub struct UpdateStatus{
    pub status: BookingStatus
}

#[derive(Serialize)]
pub struct BookingDto{
    pub id: i32,
    pub username: String,
    pub user_id: i32,
    pub lessor_id: i32,
    pub resource_name: String,
    pub resource_id: i32,
    pub quantity: i32,
    pub location: Option<String>,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
    pub status: BookingStatus,
    pub created_at: DateTime<Utc>
}

#[derive(Debug, Deserialize, Serialize, Validate)]
pub struct CreateBooking{
    pub resource_id: i32,
    pub user_id: i32,
    pub location: Option<String>,
    pub start_date: DateTime<Utc>,
    pub end_date: DateTime<Utc>,
    pub quantity: Option<i32>
}

#[derive(FromForm, Debug)]
pub struct BookingQuery{
    pub user_id: Option<i32>,
    pub status: Option<BookingStatus>,
    pub lessor_id: Option<i32>
}

#[derive(Clone, Copy, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "crate::models::user_model::Entity"
        from = "Column::UserId"
        to = "user_model::Column::Id"
    )]
    User,
    #[sea_orm(
        belongs_to = "crate::models::resource_model::Entity"
        from = "Column::ResourceId"
        to = "resource_model::Column::Id"
    )]
    Resource,
}

impl Related<user_model::Entity> for Entity{
    fn to() -> sea_orm::RelationDef {
        Relation::User.def()
    }
}

impl Related<resource_model::Entity> for Entity{
    fn to() -> RelationDef {
        Relation::Resource.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}