use sea_orm::entity::prelude::*;
use rocket::serde::{Deserialize, Serialize};
use validator::Validate;

use crate::models::resource_model;


#[derive(Clone, Debug, DeriveEntityModel, PartialEq, Serialize)]
#[sea_orm(table_name="categories")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub description: String
}

#[derive(Deserialize, Validate, Debug)]
pub struct CreateCategory{
    #[validate(length(min=3))]
    pub name: String,
    pub description: String
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