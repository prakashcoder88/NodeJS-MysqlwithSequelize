const bcrypt = require('bcrypt')

async function passwordencrypt(password) {
    let salt = await bcrypt.genSalt(10);
    let passwordHash = bcrypt.hash(password, salt);
    return passwordHash;
  }
  
  function validatePassword(password) {
    const pattern = 
    // /^[^\s]{6,10}$/;
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$&%])(?!.*\s).{6,15}$/;
    return pattern.test(password);
  }

  function referralCode(length){
    let code = "";
    const CHARACTER_SET =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  
    const CHARACTER_SETLENGTH = CHARACTER_SET.length
    let CHARACTER = 0
    while(CHARACTER < length){
        code += CHARACTER_SET.charAt(Math.floor(Math.random() * CHARACTER_SETLENGTH));
        CHARACTER += 1;
    } 
    return code;
}

  module.exports = { referralCode, passwordencrypt, validatePassword };