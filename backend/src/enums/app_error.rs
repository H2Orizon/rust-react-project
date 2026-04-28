use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError{

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("User NotFound")]
    UserNotFound(),

    #[error("Booking NotFound")]
    BookingNotFound(),

    #[error("Resource NotFound")]
    ResourceNotFound(),

    #[error("Resource is not available for selected time")]
    ResourceNotAvailable(),

    #[error("category NotFound")]
    CategoryNotFound(),

    #[error("Passwords Do Not Match")]
    PasswordsDontMatch(),

    #[error("Invalid credentials")]
    InvalidCredentials(),

    #[error("User Do Not Exist")]
    UserDontExist(),

    #[error("Database error: {0}")]
    Db(#[from] sea_orm::DbErr)
}