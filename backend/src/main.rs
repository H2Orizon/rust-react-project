#[macro_use] extern crate rocket;
use std::fs;

use rocket::{fs::FileServer, launch};

use crate::{controllers::
    {backup_controller::{get_backups, load_backups}, booking_controller::{create_booking, get_all_booking, get_booking, update_status}, category_controller::{create_category, delete_category, get_all_categories, get_categories_pagination, get_category, update_category}, resource_controller::{create_resources, delete_image, delete_resource, get_all_resources, get_one_resource, update_resource, upload_image}, user_controller::{get_profile, login, register}}, cors::cors, db::{get_figment, init_db}};

mod db;
mod controllers;
mod services;
mod models;
mod enums;
mod validators;
mod auth;
mod cors;
mod utility;
mod scheduler;


#[launch]
async fn rocket() -> _ {
    let db = init_db().await;

    scheduler::start_tasks(db.clone());

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
        get_categories_pagination, delete_category
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
    .mount("/backup", routes![
        load_backups, get_backups
    ])
    .mount("/uploads", FileServer::from("./uploads"))
}