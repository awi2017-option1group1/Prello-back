"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], User.prototype, "id");
    __decorate([
        typeorm_1.Column('text')
    ], User.prototype, "lastname");
    __decorate([
        typeorm_1.Column('text')
    ], User.prototype, "firstname");
    __decorate([
        typeorm_1.Column('text')
    ], User.prototype, "pseudo");
    __decorate([
        typeorm_1.Column('text')
    ], User.prototype, "biography");
    __decorate([
        typeorm_1.Column('boolean')
    ], User.prototype, "notificationsEnabled");
    __decorate([
        typeorm_1.Column('text')
    ], User.prototype, "email");
    __decorate([
        typeorm_1.Column('text')
    ], User.prototype, "password");
    User = __decorate([
        typeorm_1.Entity()
    ], User);
    return User;
}());
exports.User = User;
