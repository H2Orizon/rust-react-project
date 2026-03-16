use sea_orm::{ActiveModelTrait, ActiveValue::Set, DatabaseConnection, EntityTrait};
use validator::Validate;
use crate::models::category_model::{ActiveModel, CreateCategory, Entity, Model};

pub async fn get_all(db: &DatabaseConnection) -> Result<Vec<Model>, sea_orm::DbErr> {
    let categories = Entity::find().all(db).await?;
    Ok(categories)
}

pub async fn get_one(db: &DatabaseConnection, id:i32) -> Result<Model, sea_orm::DbErr>{
    let category = Entity::find_by_id(id).one(db).await?
    .ok_or(sea_orm::DbErr::RecordNotFound("Resource not found".into()))?;
    Ok(category)
}

pub async fn create(db: &DatabaseConnection, data: CreateCategory) -> Result<Model, sea_orm::DbErr> {
    data.validate().map_err(|e| sea_orm::DbErr::Custom(e.to_string()))?;

    let new_category = ActiveModel{
        name: Set(data.name),
        description: Set(data.description),
        ..Default::default()
    };

    new_category.insert(db).await
}

// pub async fn delete(db: &DatabaseConnection, id: i32) -> Result<(), sea_orm::DbErr>{
//     Entity::delete_by_id(id).exec(db).await?;
//     Ok(())
// }
