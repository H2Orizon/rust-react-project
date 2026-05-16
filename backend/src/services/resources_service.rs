use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait, ModelTrait, PaginatorTrait, QueryFilter};
use validator::Validate;

use crate::{auth::guard::AuthUser, enums::app_error::AppError, models::{category_model::{self, Entity as CategoriesEntity}, resource_model::{ActiveModel, Column, CreateResource, Entity, Model, PaginatedResponseResources, ResourceDto, ResourceListDto, ResourceQuery, UpdateResource}, user_model::Entity as UserEntity}, services::{booking_service, image_service}};

pub async fn get_one_model(db: &DatabaseConnection, id:i32) -> Result<Model, AppError>{
    let resource = Entity::find_by_id(id).one(db)
    .await?
    .ok_or(AppError::ResourceNotFound())?;
    Ok(resource)
}

pub async fn get_all(db: &DatabaseConnection, query_param: ResourceQuery) -> Result<PaginatedResponseResources, AppError>{

    let mut query = Entity::find()
        .find_also_related(CategoriesEntity);

    if let Some(user_id) = query_param.user_id{
        query = query.filter(Column::UserId.eq(user_id))
    }
    
    if let Some(category) = query_param.category{
        query = query.filter(category_model::Column::Id.eq(category));
    }

    if let Some(resource_name) = query_param.resource_name{
        query = query.filter(Column::Name.contains(resource_name))
    }

    if let Some(min_price) = query_param.min_price{
        query = query.filter(Column::Price.gte(min_price))
    }

    if let Some(max_price) = query_param.max_price{
        query = query.filter(Column::Price.lte(max_price))
    }

    if let Some(payment_for) = query_param.payment_for{
        query = query.filter(Column::PaymentFor.eq(payment_for))
    }

    let per_page = query_param.per_page.unwrap_or(10).clamp(1, 100);
    let page = query_param.page.unwrap_or(1).max(1);

    let paginateor = query.paginate(db, per_page);

    let total = paginateor.num_items().await?;
    let total_pages= paginateor.num_pages().await?;

    let resources = paginateor.fetch_page(page-1).await?;

    let mut resources_dtos = Vec::new();
    let resource_ids: Vec<i32> = resources.iter().map(|(r, _)| r.id).collect();

    let booking_map = booking_service::get_booking_map(db, &resource_ids).await?;
    let image_map = image_service::get_img_for_resource(db, &resource_ids).await?;


    for (res, category) in resources {

        let booked = booking_map.get(&res.id).cloned().unwrap_or(0);
        let image = image_map.get(&res.id).cloned();

        resources_dtos.push(ResourceListDto{
            id: res.id,
            name: res.name,
            price: res.price,
            location: res.location,
            capacity: res.capacity,
            availble_now: (res.capacity - booked).max(0), //need a fix
            category: category.map(|c| c.name).unwrap_or("Unknown".into()),
            image: image,
            payment_for: res.payment_for
        });
    }

    Ok(PaginatedResponseResources { 
        resources: resources_dtos, 
        total: total, 
        page: page, 
        per_page: per_page, 
        total_pages: total_pages 
    })
}

pub async fn get_one(db: &DatabaseConnection, id:i32) -> Result<ResourceDto, AppError>{
    let resource = get_one_model(db, id).await?;
    println!("MODEL: {:?}", resource);
    let category = resource.find_related(CategoriesEntity).one(db).await?;

    let category_name = category.map(|c| c.name).unwrap_or("Unknown".to_string());

    let username = resource.find_related(UserEntity).one(db).await?.unwrap().username;

    let booked = booking_service::get_resource_booked(db, resource.id).await?;

    let images = image_service::get_all_img_for_resource(db, resource.id).await?;

    let next_available_at = booking_service::get_next_available(db, resource.id).await.unwrap_or(None);

    println!("Hi i have {:?}",next_available_at);

    Ok(
        ResourceDto { 
        id: resource.id, 
        name: resource.name,
        description: resource.description,
        price: resource.price,
        location: resource.location,
        capacity: resource.capacity,
        availble_now: resource.capacity - booked,
        next_available_at: next_available_at,
        category: category_name,
        username: username,
        user_id: resource.user_id,
        auto_approved: resource.auto_approved,
        images: Some(images),
        payment_for: resource.payment_for
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
        auto_approved: Set(data.auto_approved),
        payment_for: Set(data.payment_for),
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

    if let Some(auto_approve) = update_dto.auto_approve{
        resource.auto_approved = Set(auto_approve)
    }

    if let Some(payment_for) = update_dto.payment_for{
        resource.payment_for = Set(payment_for)
    }

    let resource= resource.update(db).await?;

    Ok(resource)
}

pub async fn delete(db: &DatabaseConnection, id: i32) -> Result<(), sea_orm::DbErr>{
    Entity::delete_by_id(id).exec(db).await?;
    Ok(())
}