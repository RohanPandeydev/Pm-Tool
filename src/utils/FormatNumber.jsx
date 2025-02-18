function FormatNumber(number) {
    

    if (number >= 10000000) {
        // If the number is greater than or equal to 100 lakh, format it as crore

        return Math.round( (number / 10000000)) + ' crore';
    }
    else if (number >= 100000) {
        // If the number is greater than or equal to 1 million, format it as millions
        return  Math.round((number / 100000)) + ' lakh';
    } else if (number >= 1000) {
        // If the number is greater than or equal to 1 thousand, format it as thousands
        return Math.round((number / 1000)) + 'K';
    }

    else {
        // If the number is less than 1000, simply return it
        return number.toString();
    }
}


export default FormatNumber