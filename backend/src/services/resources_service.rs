use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait, ModelTrait, QueryFilter};
use validator::Validate;

use crate::{auth::guard::AuthUser, models::{category_model::Entity as CategoriesEntity, 
    resource_model::{ActiveModel, Column, CreateResource, Entity, Model, ResourceDto, ResourceQuery, UpdateResource}, user_model::Entity as UserEntity}};


pub async fn get_one_model(db: &DatabaseConnection, id:i32) -> Result<Model, sea_orm::DbErr>{
    let resource = Entity::find_by_id(id).one(db)
    .await?
    .ok_or(sea_orm::DbErr::RecordNotFound("Resource not found".into()))?;
    Ok(resource)
}

pub async fn get_all(db: &DatabaseConnection, query_param: ResourceQuery) -> Result<Vec<ResourceDto>, sea_orm::DbErr>{
    
    let mut query = Entity::find()
        .find_also_related(CategoriesEntity)
        .find_also_related(UserEntity);

    if let Some(user_id) = query_param.user_id{
        query = query.filter(Column::UserId.eq(user_id))
    }
    
    let resources = query.all(db).await?;

    let mut resources_dtos = Vec::new();

    for (res, category, user) in resources {
        resources_dtos.push(ResourceDto{
            id: res.id,
            name: res.name,
            description: res.description,
            price: res.price,
            location: res.location,
            created_at: res.created_at,
            capacity: res.capacity,
            category: category.map(|c| c.name).unwrap_or("Unknown".into()),
            username: user.map(|u| u.username).unwrap_or("Unknown".into()),
            user_id: res.user_id
        });
    }
    Ok(resources_dtos)
}

pub async fn get_one(db: &DatabaseConnection, id:i32) -> Result<ResourceDto, sea_orm::DbErr>{
    let resource = get_one_model(db, id).await?;
    let category_name = resource.find_related(CategoriesEntity).one(db).await?
    .unwrap().name;
    let username = resource.find_related(UserEntity).one(db).await?.unwrap().username;
    Ok(
        ResourceDto { 
        id: resource.id, 
        name: resource.name,
        description: resource.description,
        price: resource.price,
        location: resource.location,
        created_at: resource.created_at,
        capacity: resource.capacity,
        category: category_name,
        username: username,
        user_id: resource.user_id
    })
}

pub async fn create(db: &DatabaseConnection, data:CreateResource, user:AuthUser) -> Result<Model, sea_orm::DbErr>{
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
        user_id: Set(user.id),
        ..Default::default()
    };

    new_resource.insert(db).await
}

pub async fn update(db: &DatabaseConnection, id:i32, update_dto: UpdateResource) -> Result<Model, sea_orm::DbErr>{
    
    let mut resource:ActiveModel = get_one_model(db, id).await?.into();

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