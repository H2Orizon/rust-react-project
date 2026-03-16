use std::env;
use rocket::request::{FromRequest, Outcome};
use rocket::{Request, http::Status};

use crate::auth::jws::verify_token;
use crate::enums::user_role::UserRole;

pub struct AuthUser{
    pub id: i32,
    pub role: UserRole
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthUser {
    type Error = ();

    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let secret = env::var("SECRET_KEY")
        .unwrap_or_else(|_| "default_secret_key".to_string());

        let auth_header = req.headers().get_one("Authorization");

        if auth_header.is_none(){
            return Outcome::Error((Status::Unauthorized, ()));
        }

        let token = auth_header.unwrap().strip_prefix("Bearer ").unwrap_or("");

        match verify_token(token, &secret) {
            Ok(claims) => Outcome::Success(
                AuthUser {
                    id: claims.sub,
                    role: claims.role
                }),

            Err(_) => Outcome::Error((Status::Unauthorized, ())),
        }
    }

}