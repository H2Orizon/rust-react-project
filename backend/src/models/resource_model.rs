use chrono::{DateTime, Utc, NaiveDateTime};
use sea_orm::{entity::prelude::*};
use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::{enums::payment_for::PaymentFor, models::{category_model, image_model::{self, ImageDto}, user_model}};

#[derive(Clone, Debug, DeriveEntityModel, PartialEq, Serialize)]
#[sea_orm(table_name = "resources")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub description: String,
    pub price: f32,
    pub capacity: i32,
    pub location: String,
    pub created_at: NaiveDateTime,
    pub category_id: i32,
    pub user_id: i32,
    pub auto_approved: bool,
    pub payment_for: PaymentFor
}

#[derive(Serialize)]
pub struct ResourceDto{
    pub id: i32,
    pub name: String,
    pub description: String,
    pub price: f32,
    pub capacity: i32,
    pub availble_now: i32,
    pub next_available_at: Option<DateTime<Utc>>,
    pub location: String,
    pub category: String,
    pub username: String,
    pub user_id: i32,
    pub auto_approved: bool,
    pub images: Option<Vec<ImageDto>>,
    pub payment_for: PaymentFor
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ResourceListDto{
    pub id: i32,
    pub name: String,
    pub price: f32,
    pub capacity: i32,
    pub availble_now: i32,
    pub location: String,
    pub category: String,
    pub image: Option<ImageDto>,
    pub payment_for: PaymentFor
}

#[derive(Deserialize, Validate, Debug)]
pub struct UpdateResource{
    pub name: Option<String>,
    pub description: Option<String>,
    pub price: Option<f32>,
    pub category_id: Option<i32>,
    pub capacity: Option<i32>,
    pub location: Option<String>,
    pub auto_approve: Option<bool>,
    pub payment_for: Option<PaymentFor>
}

#[derive(FromForm, Debug, Deserialize, Serialize, Validate)]
pub struct CreateResource{
    #[validate(length(min=5))]
    pub name: String,
    pub description: String,
    pub price: f32,
    pub capacity: Option<i32>,
    pub location: String,
    pub category_id: i32,
    pub auto_approved: bool,
    pub payment_for: PaymentFor
}

#[derive(FromForm, Debug)]
pub struct ResourceQuery{
    pub user_id: Option<i32>,
    pub resource_name: Option<String>,
    pub category: Option<i32>,
    pub min_price: Option<i32>,
    pub max_price: Option<i32>,
    pub per_page: Option<u64>,
    pub page: Option<u64>,
    pub payment_for: Option<PaymentFor>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaginatedResponseResources{
    pub resources: Vec<ResourceListDto>,
    pub total: u64,
    pub page: u64,
    pub per_page: u64,
    pub total_pages: u64,
}

#[derive(Clone, Copy, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "crate::models::category_model::Entity"
        from = "Column::CategoryId"
        to = "category_model::Column::Id"
    )]
    Category,

    #[sea_orm(
        belongs_to = "crate::models::user_model::Entity"
        from = "Column::UserId"
        to = "user_model::Column::Id"
    )]
    Users,
    
    #[sea_orm(has_many = "crate::models::image_model::Entity")]
    ResourceImage
}

impl Related<category_model::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Category.def()
    }
}

impl Related<user_model::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Users.def()
    }
}

impl  Related<image_model::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::ResourceImage.def()
    }
}

impl ActiveModelBehavior for ActiveModel{}