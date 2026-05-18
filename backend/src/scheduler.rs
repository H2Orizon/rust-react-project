use std::time::Duration;

use sea_orm::DatabaseConnection;

use crate::services::{
    backup_service,
    booking_service
};

pub fn start_tasks( db: DatabaseConnection) {

    let booking_db = db.clone();

    tokio::spawn(async move {
        loop {
            booking_service::auto_upadate_status(&booking_db).await;
            tokio::time::sleep(
                Duration::from_secs(300)
            ).await;
        }
    });

    tokio::spawn(async move {

        loop {
            match backup_service::create_backup() {
                Ok(_) => println!("Backup created"),
                Err(err) => println!("Backup error: {}", err)
            }

            backup_service::cleanup_old_backups().await;

            tokio::time::sleep(
                Duration::from_secs(
                    60 * 60 * 6
                )
            ).await;
        }
    });
}