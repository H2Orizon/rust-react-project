use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait, ModelTrait, QueryFilter};
use validator::Validate;

use crate::{auth::guard::AuthUser, enums::app_error::AppError, models::{category_model::Entity as CategoriesEntity, resource_model::{ActiveModel, Column, CreateResource, Entity, Model, ResourceDto, ResourceListDto, ResourceQuery, UpdateResource}, user_model::Entity as UserEntity}, services::booking_service};


pub async fn get_one_model(db: &DatabaseConnection, id:i32) -> Result<Model, AppError>{
    let resource = Entity::find_by_id(id).one(db)
    .await?
    .ok_or(AppError::ResourceNotFound())?;
    Ok(resource)
}

pub async fn get_all(db: &DatabaseConnection, query_param: ResourceQuery) -> Result<Vec<ResourceListDto>, AppError>{
    
    let mut query = Entity::find()
        .find_also_related(CategoriesEntity);

    if let Some(user_id) = query_param.user_id{
        query = query.filter(Column::UserId.eq(user_id))
    }
    
    let resources = query.all(db).await?;

    let mut resources_dtos = Vec::new();

    for (res, category) in resources {

        let booked = booking_service::get_resource_booked(db, res.id).await?;


        resources_dtos.push(ResourceListDto{
            id: res.id,
            name: res.name,
            price: res.price,
            location: res.location,
            capacity: res.capacity,
            availble_now: res.capacity - booked,
            category: category.map(|c| c.name).unwrap_or("Unknown".into()),
        });
    }
    Ok(resources_dtos)
}

pub async fn get_one(db: &DatabaseConnection, id:i32) -> Result<ResourceDto, AppError>{
    let resource = get_one_model(db, id).await?;
    println!("MODEL: {:?}", resource);
    let category_name = resource.find_related(CategoriesEntity).one(db).await?
    .unwrap().name;
    let username = resource.find_related(UserEntity).one(db).await?.unwrap().username;

    let booked = booking_service::get_resource_booked(db, resource.id).await?;

    Ok(
        ResourceDto { 
        id: resource.id, 
        name: resource.name,
        description: resource.description,
        price: resource.price,
        location: resource.location,
        capacity: resource.capacity,
        availble_now: resource.capacity - booked,
        next_available_at: booking_service::get_next_availeble(db, resource.id).await?,
        category: category_name,
        username: username,
        user_id: resource.user_id
    })
}

pub async fn create(db: &DatabaseConnection, data:CreateResource, user:AuthUser) -> Result<Model, AppError>{
    data.validate().map_err(|e| {
        println!("{e}");
        AppError::Validation(e.to_string())
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

    Ok(new_resource.insert(db).await?)
}

pub async fn update(db: &DatabaseConnection, id:i32, update_dto: UpdateResource) -> Result<Model, AppError>{
    
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