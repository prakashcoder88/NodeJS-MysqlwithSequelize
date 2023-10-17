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


  module.exports = { passwordencrypt, validatePassword };