#[macro_use] extern crate rocket;
use std::{fs, time::Duration};

use rocket::{fs::FileServer, launch};

use crate::{controllers::
    {booking_controller::{create_booking, get_all_booking, get_booking, update_status}, 
    category_controller::{create_category, get_all_categories, get_categories_pagination, get_category, update_category}, 
    resource_controller::{create_resources, delete_image, delete_resource, get_all_resources, get_one_resource, update_resource, upload_image}, 
    user_controller::{get_profile, login, register}}, cors::cors, db::{get_figment, init_db}, services::booking_service};

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

    fs::create_dir_all("./uploads/resources")
        .expect("Failed to create upload directories");

    rocket::custom(get_figment().await)
    .attach(cors())
    .manage(db)
    .mount("/categories", routes![
        get_all_categories, get_category
        ])
    .mount("/admin", routes![
        create_category, update_category,
        get_categories_pagination
    ])
    .mount("/resources", routes![
        get_all_resources, get_one_resource,
        create_resources,
        delete_resource, update_resource,
        upload_image, delete_image
    ])
    .mount("/user", routes![
        login, register, get_profile
    ])
    .mount("/booking", routes![
        get_all_booking, get_booking,
        create_booking, update_status
    ])
    .mount("/uploads", FileServer::from("./uploads"))
}