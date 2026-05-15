use std::env;
use handlebars::Handlebars;
use lettre::{AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor, message::{Mailbox, header::ContentType}, transport::smtp::authentication::Credentials};
use serde_json::json;

pub  fn render_resource_rented_template( username: &str, resource_name: &str, 
        renter_name: &str, start_date: &str, end_date: &str) -> Result<String, String> {

    let mut handlebars = Handlebars::new();

    handlebars.register_template_file(
            "resource_rented_template",
            "src/templates/resource_rented.hbs",
        )
        .map_err(|e| e.to_string())?;

    let data = json!({
        "username": username,
        "resource_name": resource_name,
        "renter_name": renter_name,
        "start_date": start_date,
        "end_date": end_date
    });

    handlebars.render("resource_rented_template", &data)
        .map_err(|e| e.to_string())

}

pub async fn send_email(from:&str, to:&str, subject: &str, html: &str) -> Result<(), String> {
    let [smtp_host, stmp_username, smtp_password];
    
    stmp_username = env::var("SMTP_USERNAME")
    .map_err(|e| e.to_string())?;
    smtp_host = env::var("SMTP_HOST")
    .map_err(|e| e.to_string())?;
    smtp_password = env::var("SMTP_PASSWORD")
    .map_err(|e| e.to_string())?;

    let email = Message::builder()
        .from(from.parse::<Mailbox>().map_err(|e| e.to_string())?)
        .to(to.parse::<Mailbox>().map_err(|e| e.to_string())?)
        .subject(subject)
        .header(ContentType::TEXT_HTML)
        .body(html.to_string())
        .map_err(|e| e.to_string())?;

    let creds = Credentials::new(stmp_username.to_owned(), smtp_password);

    let mailer = AsyncSmtpTransport::<Tokio1Executor>
    ::starttls_relay(&smtp_host)
    .map_err(|e| e.to_string())?.credentials(creds).build();

    match mailer
        .send(email)
        .await{
            Ok(_) => println!("Email sent successfully!"),
            Err(e) => eprintln!("Could not send email: {:?}", e),
    }
    
    Ok(())

}