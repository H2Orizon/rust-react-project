use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError{

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Email error: {0}")]
    Email(String),

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

    #[error("Maximum number of images reached")]
    MaxImagesReached(),

    #[error("Entity NotFound")]
    NotFound(),

    #[error("Database error: {0}")]
    Db(#[from] sea_orm::DbErr),

}

impl From<String> for AppError {
    fn from(value: String) -> Self {
        AppError::Email(value)
    }
}