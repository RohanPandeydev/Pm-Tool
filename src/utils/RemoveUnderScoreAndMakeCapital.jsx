import config from "../config";

export default function RemoveUnderscore(text) {
    // Split the text by hyphens
    let parts = text?.split('_');
    // Capitalize the first letter of each part and join them with spaces
    let formattedText = parts?.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    // Capitalize the first letter of the entire string
    let result = formattedText?.charAt(0)?.toUpperCase() + formattedText?.slice(1);
    return result;
}