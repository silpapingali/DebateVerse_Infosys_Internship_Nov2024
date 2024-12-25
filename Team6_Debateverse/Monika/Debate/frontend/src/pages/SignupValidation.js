function SignupValidation(values) {
    let errors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (values.email === "") {
        errors.email = "Email should not be empty";
    } else if (!email_pattern.test(values.email)) {
        errors.email = "Invalid email format";
    }

    if (values.password === "") {
        errors.password = "Password should not be empty";
    }

    if (values.confirmPassword === "") {
        errors.confirmPassword = "Confirm password should not be empty";
    } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
}

export default SignupValidation;
