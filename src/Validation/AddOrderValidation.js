export default function validateInfo(values) {
    let errors = {};

    if(!values.name.trim()) {
        errors.name = "Customer name required";
    }

    if(!values.address.trim()) {
        errors.address = "Delivery address required";
    }

    return errors;
}