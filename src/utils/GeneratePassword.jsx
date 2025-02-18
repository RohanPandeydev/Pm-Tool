function Generatepass(length = 8) {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    // const special = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    
    // Make sure password contains at least one of each type
    const allChars = lowercase + uppercase + digits;
    let password = "";
    
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    // password += special[Math.floor(Math.random() * special.length)];

    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password to ensure random distribution of characters
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    return password;
}
export default Generatepass;