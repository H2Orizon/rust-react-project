use sea_orm::{ActiveModelTrait, ActiveValue::Set, DatabaseConnection, EntityTrait, ModelTrait};
use validator::Validate;

use crate::{models::{category_model::Entity as CategoriesEntity, 
    resource_model::{ActiveModel, CreateResource, Entity, Model, ResourceDto, UpdateResource}}};


pub async fn get_one_model(db: &DatabaseConnection, id:i32) -> Result<Model, sea_orm::DbErr>{
    let resource = Entity::find_by_id(id).one(db)
    .await?
    .ok_or(sea_orm::DbErr::RecordNotFound("Resource not found".into()))?;
    Ok(resource)
}

pub async fn get_all(db: &DatabaseConnection) -> Result<Vec<ResourceDto>, sea_orm::DbErr>{
    let resources = Entity::find().all(db).await?;
    let mut resources_dtos = Vec::new();

    for res in resources {
        let category = res.find_related(CategoriesEntity).one(db).await?;
        resources_dtos.push(ResourceDto{
            id: res.id,
            name: res.name,
            description: res.description,
            price: res.price,
            location: res.location,
            created_at: res.created_at,
            capacity: res.capacity,
            category: category.map(|c| c.name).unwrap()
        });
    }
    Ok(resources_dtos)
}

pub async fn get_one(db: &DatabaseConnection, id:i32) -> Result<ResourceDto, sea_orm::DbErr>{
    let resource = get_one_model(db, id).await?;
    let category = resource.find_related(CategoriesEntity).one(db).await?
    .unwrap().name;
    Ok(
        ResourceDto { 
        id: resource.id, 
        name: resource.name,
        description: resource.description,
        price: resource.price,
        location: resource.location,
        created_at: resource.created_at,
        capacity: resource.capacity,
        category: category
    })
}

pub async fn create(db: &DatabaseConnection, data:CreateResource) -> Result<Model, sea_orm::DbErr>{
    data.validate().map_err(|e| {
        println!("{e}");
        sea_orm::DbErr::Custom(e.to_string())
    })?;

    let new_resource = ActiveModel{
        name: Set(data.name),
        description: Set(data.description),
        category_id: Set(data.category_id),
        capacity: Set(data.capacity.unwrap_or(1)),
        location: Set(data.location),
        price: Set(data.price),
        ..Default::default()
    };

    new_resource.insert(db).await
}

pub async fn update(db: &DatabaseConnection, id:i32, update_dto: UpdateResource) -> Result<Model, sea_orm::DbErr>{
    let resource = get_one_model(db, id).await?;
    
    let mut resource:ActiveModel = resource.into();

    if let Some(name) = update_dto.name {
        resource.name = Set(name)
    }
    if let Some(description) = update_dto.description {
        resource.description = Set(description)
    }
    if let Some(price) = update_dto.price {
        resource.price = Set(price)
    }
    if let Some(category_id) = update_dto.category_id {
        resource.category_id = Set(category_id)
    }
    if let Some(capacity) = update_dto.capacity {
        resource.capacity = Set(capacity)
    }
    if let Some(location) = update_dto.location{
        resource.location = Set(location)
    }

    let resource= resource.update(db).await?;

    Ok(resource)
}

pub async fn delete(db: &DatabaseConnection, id: i32) -> Result<(), sea_orm::DbErr>{
    Entity::delete_by_id(id).exec(db).await?;
    Ok(())
}