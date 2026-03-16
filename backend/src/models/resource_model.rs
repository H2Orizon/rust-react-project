use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};
use validator::Validate;

use crate::models::category_model;

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
    pub created_at: DateTime,
    pub category_id: i32
}

#[derive(Serialize)]
pub struct ResourceDto{
    pub id: i32,
    pub name: String,
    pub description: String,
    pub price: f32,
    pub capacity: i32,
    pub location: String,
    pub created_at: DateTime,
    pub category: String
}

#[derive(Deserialize, Validate, Debug)]
pub struct UpdateResource{
    pub name: Option<String>,
    pub description: Option<String>,
    pub price: Option<f32>,
    pub category_id: Option<i32>,
    pub capacity: Option<i32>,
    pub location: Option<String>
}

#[derive(FromForm, Debug, Deserialize, Serialize, Validate)]
pub struct CreateResource{
    #[validate(length(min=5))]
    pub name: String,
    pub description: String,
    pub price: f32,
    pub capacity: Option<i32>,
    pub location: String,
    pub category_id: i32
}

#[derive(Clone, Copy, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "crate::models::category_model::Entity"
        from = "Column::CategoryId"
        to = "category_model::Column::Id"
    )]
    Category,
}

impl Related<category_model::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Category.def()
    }
}

impl ActiveModelBehavior for ActiveModel{}