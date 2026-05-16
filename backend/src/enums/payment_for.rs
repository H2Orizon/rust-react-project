use sea_orm::{DeriveActiveEnum, EnumIter};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum, Serialize, Deserialize, FromFormField)]
#[sea_orm(rs_type = "String", db_type = "Text")]
#[serde(rename_all = "lowercase")]
pub enum PaymentFor {
    #[sea_orm(string_value="month")]
    Month,
    #[sea_orm(string_value="day")]
    Day,
    #[sea_orm(string_value="hour")]
    Hour,
}