use std::{collections::HashMap, fs, path::PathBuf};
use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait, PaginatorTrait, QueryFilter, QueryOrder};
use crate::{enums::app_error::AppError, models::image_model::{ActiveModel, Column, Entity, ImageDto, Model}};

pub async fn add_new_image(db: &DatabaseConnection, resource_id: i32, file: String) -> Result<Model, AppError> {
    if !can_add_more_image(db, resource_id).await.map_err(|e| e.to_string())?{
        return Err(AppError::MaxImagesReached());
    }

    let new_img = ActiveModel{
        resource_id: Set(resource_id),
        path: Set(file.to_string()),
        ..Default::default()
    };

    Ok(new_img.insert(db).await?)
}

pub async fn get_img_for_resource(db: &DatabaseConnection, resource_ids: &[i32]) -> Result<HashMap<i32, ImageDto>, AppError> {
    let images = Entity::find()
        .filter(Column::ResourceId.is_in(resource_ids.to_vec()))
        .order_by_asc(Column::Id)
        .all(db)
        .await?;

    let mut map = HashMap::new();
    for image in images {
        map.entry(image.resource_id)
            .or_insert(ImageDto{
                id: image.id,
                path: image.path
            });
    }

    Ok(map)
}

pub async fn get_all_img_for_resource(db: &DatabaseConnection, resource_id: i32) -> Result<Vec<ImageDto>, AppError>{
    let images = Entity::find()
        .filter(Column::ResourceId.eq(resource_id))
        .order_by_asc(Column::Id)
        .all(db)
        .await?;

    let mut image_dtos = Vec::new();

    for image in images{
        image_dtos.push(ImageDto{
            id: image.id,
            path: image.path
        });
    };

    Ok(image_dtos)
}

pub async fn can_add_more_image(db: &DatabaseConnection, resource_id: i32) -> Result<bool, AppError> {
    let coutn =  Entity::find()
        .filter(Column::ResourceId.eq(resource_id))
        .count(db)
        .await?;

    Ok(coutn <= 5)
}

pub async fn delete_image(db: &DatabaseConnection, id: i32) -> Result<(), AppError> {

    let image = Entity::find_by_id(id)
        .one(db)
        .await?
        .ok_or(AppError::NotFound())?;

    let path = PathBuf::from("./uploads")
        .join(&image.path);

    if path.exists() {
        fs::remove_file(path)
            .map_err(|e| AppError::Validation(e.to_string()))?;
    }

    Entity::delete_by_id(id)
        .exec(db)
        .await?;

    Ok(())
}