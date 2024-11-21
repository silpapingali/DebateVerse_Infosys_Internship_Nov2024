function Validation(values){
    let errors = {}
    const email_pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

    if(values.email === ""){
        errors.email = "Name should not be empty"
    }
    else if(!email_pattern.test(values.email)){
        errors.email ="Email didn't match"
    }else {
        errors.mail =""
    }
if(values.password === "") {
    errors.password = "Password should not be empty"
}
else if(!password_pattern.test(values.password)){
    errors.password = "Password didn't match"
}
else{
    errors.password = ""
}
return errors ;

}
export default Validation ;