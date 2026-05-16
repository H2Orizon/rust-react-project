use sea_orm::entity::prelude::*;
use rocket::serde::{Deserialize, Serialize};
use validator::Validate;

use crate::models::resource_model;


#[derive(Clone, Debug, DeriveEntityModel, PartialEq, Serialize, Deserialize)]
#[sea_orm(table_name="categories")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub description: String,
    pub is_movable: bool
}

#[derive(Deserialize, Validate, Debug)]
pub struct CreateCategory{
    #[validate(length(min=3))]
    pub name: String,
    pub description: String,
    pub is_movable: bool
}

#[derive(Deserialize, Validate, Debug)]
pub struct  PaginatedResponseCategory{
    pub categores: Vec<Model>,
    pub total: u64,
    pub page: u64,
    pub per_page: u64,
    pub total_pages: u64,
}

#[derive(Deserialize, Serialize, Debug, Validate)]
pub struct UpdateCategory{
    #[validate(length(min=3))]
    pub name: Option<String>,
    pub description: Option<String>,
    pub is_movable: Option<bool>,
}

#[derive(Clone, Copy, Debug, EnumIter, DeriveRelation )]
pub enum Relation {
    #[sea_orm(has_many = "crate::models::resource_model::Entity")]
    Resource,
}

impl Related<resource_model::Entity> for Entity{
    fn to() -> RelationDef{
        Relation::Resource.def()
    }
}

impl ActiveModelBehavior for ActiveModel{}