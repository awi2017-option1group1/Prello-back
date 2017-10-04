import * as bcrypt from 'bcrypt-nodejs';
var Password = (function () {
    function Password() {
    }
    Password.encrypt = function (password) {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, function (err2, hash) {
                return hash;
            });
        });
    };
    return Password;
}());
export { Password };
//# sourceMappingURL=password.js.map