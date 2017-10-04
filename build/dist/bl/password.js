import * as bcrypt from 'bcrypt-nodejs';
var Password = (function () {
    function Password() {
    }
    Password.encrypt = function (password) {
        bcrypt.genSalt(10, function (saltGenerationError, salt) {
            if (saltGenerationError) {
                console.log('Error while generating hash : ', saltGenerationError);
            }
            else {
                bcrypt.hash(password, salt, function (hashError, hash) {
                    if (hashError) {
                        console.log('Error while hashing password : ', hashError);
                        return;
                    }
                    else {
                        return hash;
                    }
                });
            }
        });
    };
    return Password;
}());
export { Password };
//# sourceMappingURL=password.js.map