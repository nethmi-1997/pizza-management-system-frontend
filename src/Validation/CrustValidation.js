export default function validateInfo(values) {
    let errors = {};

    if(!values.name.trim()) {
        errors.name = "Crust name required";
    }

    if(!values.smallPrice) {
        errors.smallPrice = "Price required";
    }

    if(!values.veg) {
        errors.veg = "Type required";
    }

    return errors;
}