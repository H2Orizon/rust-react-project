use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use validator::Validate;
use chrono::{NaiveDateTime, NaiveDate};

use crate::{enums::user_role::UserRole, models::booking_model};
use crate::validators::password_validator::validator_password;

#[derive(Clone, Debug, Serialize, DeriveEntityModel, PartialEq, Validate)]
#[sea_orm(table_name="users")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id: i32,
    pub username: String,
    pub email: String,
    #[validate(length(min = 10, max = 15))]
    pub phone: Option<String>,
    pub city: Option<String>,
    pub password: String,
    pub role: UserRole,
    pub created_at: NaiveDateTime,
    pub is_active: bool
}

#[derive(Serialize, Deserialize)]
pub struct UserDto{
    pub id: i32,
    pub username: String,
    pub email: String,
    pub phone: Option<String>,
    pub city: Option<String>,
    pub role: UserRole,
    pub created_at: NaiveDate,
    pub is_active: bool
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateUser{
    #[validate(length(min=5))]
    pub username: String,
    #[validate(email)]
    pub email: String,
    pub phone: Option<String>,
    pub city: Option<String>,
    #[validate(length(min=8, message="pass to short"))]
    #[validate(custom(function = "validator_password"))]
    pub password: String,
    pub password_conf: String
}

#[derive(FromForm, Validate, Deserialize)]
pub struct LoginUserForm{
    #[validate(email)]
    pub email: String,
    pub password: String
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "crate::models::booking_model::Entity")]
    Booking,
}

impl Related<booking_model::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Booking.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}