use std::{fs, process::Command};

pub fn create_backup() -> Result<(), String> {
    let filename = format!(
        "backups/backup_{}.sql", 
        chrono::Utc::now().timestamp()
    );

    let output = Command::new("pg_dump")
        .args([
            "-U",
            "postgres",
            "-d",
            "rust_db",
            "-f",
            &filename
        ]).env("PGPASSWORD", 
            std::env::var("DB_PASSWORD").unwrap())
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success(){
        return  Err(
            String::from_utf8_lossy(
                &output.stderr
            ).to_string()
        );
    }
    Ok(())
}

pub async fn restore_backup(file: &str) -> Result<(), String>{
    let output = Command::new("pg_restore")
        .args([
            "-U",
            "postgres",
            "-d",
            "rust_db",
            "-f",
            &file
        ]).env("PGPASSWORD", 
            std::env::var("DB_PASSWORD").unwrap())
        .output()
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err(
            String::from_utf8_lossy(
                &output.stderr
            ).to_string()
        );
    }

    Ok(())
}

pub async fn cleanup_old_backups() {

    let entries = fs::read_dir("backups").unwrap();

    for entry in entries {

        let path = entry.unwrap().path();

        let metadata = fs::metadata(&path).unwrap();

        let modified = metadata.modified().unwrap();

        let age = modified.elapsed().unwrap();

        if age.as_secs() > 60 * 60 * 24 * 7 {

            fs::remove_file(path).unwrap();
        }
    }
}

pub async fn list_backups() -> Vec<String> {

    std::fs::read_dir("backups").unwrap()
        .filter_map(|entry| {
            entry.ok().map(|e| {
                e.file_name()
                    .to_string_lossy()
                    .to_string()
            })
        })
        .collect()
}