use validator::ValidationError;

pub fn validator_password(password: &str) -> Result<(), ValidationError> {
    let has_upper = password.chars().any(|c| c.is_uppercase());
    let has_lower = password.chars().any(|c| c.is_lowercase());
    let has_digit = password.chars().any(|c| c.is_numeric());
    let has_special = password.chars().any(|c| !c.is_alphanumeric());

    if has_upper && has_lower && has_digit && has_special{
        Ok(())
    }else {
        let mut err = ValidationError::new("weak_password");
        let mut pass_err = "".to_string();
        if !has_upper {
            pass_err += "hasn't upper\n"
        }
        if !has_lower {
            pass_err += "hasn't lower\n"
        }
        if !has_digit {
            pass_err += "hasn't digit\n"
        }
        if !has_special {
            pass_err += "hasn't special\n"
        }
        err.message = Some(pass_err.into());
        Err(err)
    }
}