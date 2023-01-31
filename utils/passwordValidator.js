let owasp = require('owasp-password-strength-test');

module.exports.validate = (password) => {
    owasp.config({
        maxLength: 20,
        minLength: 8
    });
    return owasp.test(password);
}
