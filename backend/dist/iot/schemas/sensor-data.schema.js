"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorDataSchema = exports.SensorData = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let SensorData = class SensorData {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SensorData.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SensorData.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ["normal", "warning", "critical"],
        default: "normal",
    }),
    __metadata("design:type", String)
], SensorData.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Array)
], SensorData.prototype, "coordinates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: Date.now }),
    __metadata("design:type", Date)
], SensorData.prototype, "timestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], SensorData.prototype, "metadata", void 0);
SensorData = __decorate([
    (0, mongoose_1.Schema)()
], SensorData);
exports.SensorData = SensorData;
exports.SensorDataSchema = mongoose_1.SchemaFactory.createForClass(SensorData);
//# sourceMappingURL=sensor-data.schema.js.map