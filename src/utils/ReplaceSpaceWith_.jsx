function replaceSpacesWithUnderscores(inputString) {
    // Replace spaces with underscores using regular expression
    return inputString.replace(/\s+/g, '_');
}

export default  replaceSpacesWithUnderscores;