use std::env;
use lettre::{AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor, message::{Mailbox, header::ContentType}, transport::smtp::authentication::Credentials};

async fn get_html_line(body: &str) -> String{

    let template = 
    r"
        <html>
            <body>
                <h1 style = 'color: red'>Hi test for HTML</h1>
                <p>Some test for html <b style='red'>".to_owned() + {body} +&"</b> letters</p>
            </body>
        </html>
    "
    .to_string();

    template
}

pub async fn send_email(from:&str, to:&str, subject: &str, body: &str) -> Result<(), String> {
    let [smtp_host, stmp_username, smtp_password];
    
    stmp_username = env::var("SMTP_USERNAME")
    .map_err(|e| e.to_string())?;
    smtp_host = env::var("SMTP_HOST")
    .map_err(|e| e.to_string())?;
    smtp_password = env::var("SMTP_PASSWORD")
    .map_err(|e| e.to_string())?;

    let html = get_html_line(body).await;

    let email = Message::builder()
        .from(from.parse::<Mailbox>().map_err(|e| e.to_string())?)
        .to(to.parse::<Mailbox>().map_err(|e| e.to_string())?)
        .subject(subject)
        .header(ContentType::TEXT_HTML)
        .body(html)
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