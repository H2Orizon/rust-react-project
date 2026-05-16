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

#[derive(Deserialize, Validate, Debug, Serialize)]
pub struct  PaginatedResponseCategory{
    pub categories: Vec<Model>,
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

#[derive(FromForm, Debug)]
pub struct CategoryQuery{
    pub name: Option<String>,
    pub description: Option<String>,
    pub is_movable: Option<bool>,
    pub per_page: Option<u64>,
    pub page: Option<u64>,
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