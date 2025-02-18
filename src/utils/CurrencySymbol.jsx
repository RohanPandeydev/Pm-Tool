export default function getCurrencySymbol(currencyCode) {
    const currencySymbols = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        INR: '₹',
        AUD: 'A$',
        CAD: 'C$',
        CHF: 'CHF',
        CNY: '¥',
        SEK: 'kr',
        NZD: 'NZ$'
        // Add more currencies as needed
    };

    return currencySymbols[currencyCode] || currencyCode;
}