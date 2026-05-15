use rocket::fs::TempFile;
use serde::{Deserialize, Serialize};
use sea_orm::entity::prelude::*;

use crate::models::resource_model;


#[derive(Clone, Debug, DeriveEntityModel, PartialEq, Serialize)]
#[sea_orm(table_name="resource_images")]
pub struct Model{
    #[sea_orm(primary_key)]
    pub id: i32,
    pub resource_id: i32,
    pub path: String
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ImageDto{
    pub id: i32,
    pub path: String
}

#[derive(Clone, Copy, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "crate::models::resource_model::Entity"
        from = "Column::ResourceId"
        to = "resource_model::Column::Id"
    )]
    Resource,
}


#[derive(FromForm)]
pub struct UploadImage<'r> {
    pub file: TempFile<'r>,
}

impl Related<resource_model::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Resource.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}