#[macro_use] extern crate rocket;
use std::time::Duration;

use rocket::launch;

use crate::{controllers::{booking_controller::{create_booking, get_all_booking, get_booking, update_status}, category_controller::{create_category, get_all_categories, get_category}, resource_controller::{create_resources, delete_resource, get_all_resources, get_one_resource, update_resource}, user_controller::{get_profile, login, register}}, cors::cors, db::{get_figment, init_db}, services::booking_service};

mod db;
mod controllers;
mod services;
mod models;
mod enums;
mod validators;
mod auth;
mod cors;
mod utility;


#[launch]
async fn rocket() -> _ {
    let db = init_db().await;

    let db_clone = db.clone();
    tokio::spawn(async move {
        loop {
            booking_service::auto_upadate_status(&db_clone).await;
            tokio::time::sleep(Duration::from_secs(300)).await;
        }
    });

    rocket::custom(get_figment().await)
    .attach(cors())
    .manage(db)
    .mount("/categories", routes![
        get_all_categories, get_category,
        create_category
        ])
    .mount("/resources", routes![
        get_all_resources, get_one_resource,
        create_resources,
        delete_resource, update_resource
    ])
    .mount("/user", routes![
        login, register, get_profile
    ])
    .mount("/booking", routes![
        get_all_booking, get_booking,
        create_booking, update_status
    ])
}