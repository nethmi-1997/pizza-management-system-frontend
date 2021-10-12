export default function validateInfo(values) {
    let errors = {};

    if(!values.name) {
        errors.name = "Customer name required";
    }

    if(!values.address) {
        errors.address = "Address required";
    }

    return errors;
}