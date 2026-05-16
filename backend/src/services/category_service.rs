use sea_orm::{ActiveModelTrait, ActiveValue::Set, DatabaseConnection, EntityTrait};
use validator::Validate;
use crate::{enums::app_error::AppError, models::category_model::{ActiveModel, CreateCategory, Entity, Model, UpdateCategory}};

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
        is_movable: Set(data.is_movable),
        ..Default::default()
    };

    Ok(new_category.insert(db).await?)
}

pub async fn updare(db: &DatabaseConnection, data: UpdateCategory, id:i32) -> Result<Model, AppError>{
    data.validate().map_err(|e| AppError::Validation(e.to_string()))?;

    let mut category: ActiveModel = get_one(db, id).await?.into();

    if let Some(name) = data.name{
        category.name = Set(name);
    }

    if let Some(description) = data.description{
        category.description = Set(description);
    }

    if let Some(is_movable) = data.is_movable{
        category.is_movable = Set(is_movable);
    }

    let category = category.update(db).await?;

    Ok(category)
    
}

// pub async fn delete(db: &DatabaseConnection, id: i32) -> Result<(), sea_orm::DbErr>{
//     Entity::delete_by_id(id).exec(db).await?;
//     Ok(())
// }
