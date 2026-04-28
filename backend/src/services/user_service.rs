use std::env;

use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier, password_hash::{ SaltString, rand_core::OsRng}};
use sea_orm::{ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use validator::Validate;

use crate::{auth::jws::create_token, enums::{app_error::AppError, user_role::UserRole}, models::user_model::{ActiveModel, Column, CreateUser, Entity, LoginUserForm, UserDto}};

fn verify_password(password: &str, hash: &str) -> bool{
    let arogn = Argon2::default();
    if let Ok(password_hash) = PasswordHash::new(hash){
        arogn.verify_password(password.as_bytes(), &password_hash).is_ok()
    }else {
        false
    }
}

pub async fn create_user(db: &DatabaseConnection, dto: CreateUser) -> Result<UserDto, AppError>{
    dto.validate().map_err(|e| {
        println!("{e}");
        AppError::Validation(e.to_string())
    })?;
    
    if dto.password != dto.password_conf{
        return Err(AppError::PasswordsDontMatch());
    }

    let salt = SaltString::generate(&mut OsRng);
    let argon = Argon2::default();
    let password_hash = 
    argon.hash_password(dto.password.as_bytes(), &salt)
    .map_err(|e|  AppError::Validation(e.to_string()))?
    .to_string();
    let mut role= UserRole::User;

    if dto.username.clone() == "Admin" {
        role = UserRole::Admin
    }

    let new_user = ActiveModel{
        username: Set(dto.username),
        email: Set(dto.email),
        phone: Set(dto.phone),
        city: Set(dto.city),
        role: Set(role),
        password: Set(password_hash),
       ..Default::default() 
    };
    let user = new_user.insert(db).await?;
        Ok(UserDto{
            id: user.id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            city: user.city,
            role: user.role,
            created_at: user.created_at.and_utc(),
            is_active: user.is_active
        })

}

pub async fn login(db: &DatabaseConnection, form:LoginUserForm) -> Result<String, AppError>{
    let user = Entity::find().filter(Column::Email.eq(form.email))
    .one(db).await?
    .ok_or(AppError::InvalidCredentials())?;

    if !verify_password(&form.password, &user.password){
        Err(AppError::InvalidCredentials())?;
    }
    let token = create_token(user.id, &env::var("SECRET_KEY").unwrap(), user.role);
    Ok(token)

}

pub async fn get_user(db: &DatabaseConnection, id: i32) -> Result<UserDto, AppError>{
    let user = Entity::find_by_id(id)
    .one(db).await?
    .ok_or(AppError::UserDontExist())?;

    Ok(UserDto { 
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
        created_at: user.created_at.and_utc(),
        is_active: user.is_active
    })

}