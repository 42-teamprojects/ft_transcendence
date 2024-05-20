export function validateRequire(values, props = undefined) {
    const errors = {};
    if (props) {
        props.forEach((prop) => {
            if (!values[prop]) {
                errors[prop] = "This field is required";
            }
        });
    } else {
        Object.keys(values).forEach((prop) => {
            if (!values[prop]) {
                errors[prop] = "This field is required";
            }
        });
    }
    return errors;
}

export function validateEmail(email) {
    const errors = {};
    if (!email) {
        errors.email = "This field is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = "Invalid email address";
    }
    return errors;
}

export function validatePassword(password) {
    const errors = {};

    if (!password) {
        errors.password = "This field is required";
    } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters long";
    } else if (!/\d/.test(password)) {
        errors.password = "Password must contain at least one numeric character";
    } else if (!isNaN(password)) {
        errors.password = "Password cannot be all numbers";
    }

    return errors;
}

export function validateUsername(username) {
    const errors = {};

    if (!username) {
        errors.username = "This field is required";
    } else if (username.length < 4) {
        errors.username = "Username must be at least 4 characters long";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.username = "Username must contain only letters, numbers, and underscores";
    }

    return errors;
}

export function validateFullName(full_name) {
    const errors = {};

    if (!full_name) {
        errors.full_name = "This field is required";
    } else if (full_name.length < 4) {
        errors.full_name = "Full name must be at least 4 characters long";
    } else if (!/^[a-zA-Z\s]+$/.test(full_name)) {
        errors.full_name = "Full name must contain only letters and spaces";
    }

    return errors;
}

export function validateConfirmPassword(password, confirm_password) {
    const errors = {};

    if (!confirm_password) {
        errors.confirm_password = "This field is required";
    } else if (password !== confirm_password) {
        errors.confirm_password = "Passwords do not match";
    }

    return errors;
}

export function validateRegister(values) {
    const errors = {};

    const email = validateEmail(values.email);
    const password = validatePassword(values.password);
    const username = validateUsername(values.username);
    const full_name = validateFullName(values.full_name);
    const confirm_password = validateConfirmPassword(values.password, values.confirm_password);

    Object.assign(errors, validateRequire(values), email, password, username, full_name, confirm_password);
    
    return errors;
}

export function validateCode(code, length = 6, field = "otp") {
    const errors = {};

    if (!code) {
        errors[field] = "This field is required";
    } else if (code.length !== length) {
        errors[field] = `Invalid ${field}`;
    }

    return errors;
}