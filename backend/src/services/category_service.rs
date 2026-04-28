use sea_orm::{ActiveModelTrait, ActiveValue::Set, DatabaseConnection, EntityTrait};
use validator::Validate;
use crate::{enums::app_error::AppError, models::category_model::{ActiveModel, CreateCategory, Entity, Model}};

pub async fn get_all(db: &DatabaseConnection) -> Result<Vec<Model>, AppError> {
    let categories = Entity::find().all(db).await?;
    Ok(categories)
}

pub async fn get_one(db: &DatabaseConnection, id:i32) -> Result<Model, AppError>{
    let category = Entity::find_by_id(id).one(db).await?
    .ok_or(AppError::CategoryNotFound())?;
    Ok(category)
}

pub async fn create(db: &DatabaseConnection, data: CreateCategory) -> Result<Model, AppError> {
    data.validate().map_err(|e| AppError::Validation(e.to_string()))?;

    let new_category = ActiveModel{
        name: Set(data.name),
        description: Set(data.description),
        ..Default::default()
    };

    Ok(new_category.insert(db).await?)
}

// pub async fn delete(db: &DatabaseConnection, id: i32) -> Result<(), sea_orm::DbErr>{
//     Entity::delete_by_id(id).exec(db).await?;
//     Ok(())
// }
