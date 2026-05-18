use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait, PaginatorTrait, QueryFilter, TransactionTrait, prelude::Expr};
use validator::Validate;
use crate::{enums::app_error::AppError, models::{category_model::{ActiveModel, CategoryQuery, Column, CreateCategory, Entity, Model, PaginatedResponseCategory, UpdateCategory}, resource_model}};

pub async fn get_all(db: &DatabaseConnection) -> Result<Vec<Model>, AppError> {
    let categories = Entity::find().all(db).await?;
    Ok(categories)
}

pub async fn get_all_for_admin(db: &DatabaseConnection, query: CategoryQuery) -> Result<PaginatedResponseCategory, AppError> {
    let mut q = Entity::find();
    
    if let Some(name) = query.name{
        q = q.filter(Column::Name.contains(name))
    }

    if let Some(description) = query.description{
        q = q.filter(Column::Description.contains(description))
    }

    if let Some(is_movable) = query.is_movable{
        q = q.filter(Column::IsMovable.eq(is_movable))
    }
    
    let per_page = query.per_page.unwrap_or(10).clamp(1, 100);
    let page = query.page.unwrap_or(1).max(1);

    let paginateor = q.paginate(db, per_page);

    let total = paginateor.num_items().await?;
    let total_pages = paginateor.num_pages().await?;
    
    let categories = paginateor.fetch_page(page-1).await?;

    let mut categories_dto = Vec::new();

    for category in categories {
        categories_dto.push(Model{
            id: category.id,
            name: category.name,
            description: category.description,
            is_movable: category.is_movable
        });
    }

    Ok(PaginatedResponseCategory{
        categories: categories_dto,
        total: total,
        page: page,
        per_page: per_page,
        total_pages: total_pages
    })
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

pub async fn delete(db: &DatabaseConnection, id: i32) -> Result<(), sea_orm::DbErr>{

    let txn = db.begin().await?;

    resource_model::Entity::update_many()
        .col_expr(resource_model::Column::CategoryId, Expr::value(1))
        .filter(resource_model::Column::CategoryId.eq(id))
        .exec(&txn)
        .await?;

    Entity::delete_by_id(id).exec(db).await?;
    
    txn.commit().await?;

    Ok(())
}
