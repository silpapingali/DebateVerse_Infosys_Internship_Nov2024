function SignupValidation(values){
    let errors = {}
    const email_pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.name === ""){
        errors.name = "Name should not be empty"
    }
    else {
        errors.name=""
    }
    if(values.email === ""){
        errors.email = "email should not be empty"
    }
    else if(!email_pattern.test(values.email)){
        errors.email ="Email didn't match"
    }else {
        errors.mail =""
    }
if(values.password === "") {
    errors.password = "Password should not be empty"
}

else{
    errors.password = ""
}
return errors ;

}
export default SignupValidation ;