const text = 'هذا الحقل مطلوب'
let required = (propertyType) => {
    return v => v && v.length > 0 || (propertyType ? propertyType : text)
}
let minLength = (propertyType, minLength) => {
    return v => v && v.length >= minLength || `${propertyType} يجب أن يكون على الأقل ${minLength} رمز`
}
let maxLength = (propertyType, maxLength) => {
    return v => v && v.length <= maxLength || `${propertyType} يجب ان يكون على الأكثر ${maxLength} رمز`
}

let emailFormat = () => {
    let regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,24})+$/
    return v => v && regex.test(v) || "يجب إدخال بريد إلكتروني صالح"
}

export default {
    required,
    minLength,
    maxLength,
    emailFormat
}