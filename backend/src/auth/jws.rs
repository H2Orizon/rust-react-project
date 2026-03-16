use chrono::{Duration, Utc};
use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};

use crate::enums::user_role::UserRole;


#[derive(Debug, Serialize, Deserialize)]
pub struct Claims{
    pub sub: i32,
    pub exp: usize,
    pub role: UserRole
}

pub fn create_token(user_id: i32, secret: &str) -> String{
    let expiration = Utc::now()
    .checked_add_signed(Duration::hours(24))
    .unwrap()
    .timestamp() as usize;

    let claims = Claims{
        sub: user_id,
        exp: expiration,
        role: UserRole::User
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_ref())
    ).unwrap()
}

pub fn verify_token(token: &str, secret: &str) -> Result<Claims, jsonwebtoken::errors::Error>{
    let data = decode::<Claims>(
        token, 
        &DecodingKey::from_secret(secret.as_ref()), 
        &Validation::default())?;

    Ok(data.claims)
}