var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
var User = (function () {
    function User() {
    }
    __decorate([
        PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], User.prototype, "id", void 0);
    __decorate([
        Column('text'),
        __metadata("design:type", String)
    ], User.prototype, "lastname", void 0);
    __decorate([
        Column('text'),
        __metadata("design:type", String)
    ], User.prototype, "firstname", void 0);
    __decorate([
        Column('text'),
        __metadata("design:type", String)
    ], User.prototype, "pseudo", void 0);
    __decorate([
        Column('text'),
        __metadata("design:type", String)
    ], User.prototype, "biography", void 0);
    __decorate([
        Column('boolean'),
        __metadata("design:type", Boolean)
    ], User.prototype, "notificationsEnabled", void 0);
    __decorate([
        Column('text'),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        Column('text'),
        __metadata("design:type", String)
    ], User.prototype, "password", void 0);
    User = __decorate([
        Entity()
    ], User);
    return User;
}());
export { User };
//# sourceMappingURL=user.js.map