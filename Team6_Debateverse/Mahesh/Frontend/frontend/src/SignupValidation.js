function Validation(values) {
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if (values.email === "") {
        error.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        error.email = "Invalid email format";
    }

    if (values.password === "") {
        error.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        error.password = "Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, and one digit";
    }

    if (values.confirmPassword === "") {
        error.confirmPassword = "Confirm Password should not be empty";
    } else if (values.confirmPassword !== values.password) {
        error.confirmPassword = "Passwords do not match";
    }

    return error;
}

export default Validation;
