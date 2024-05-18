"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BonusModelSchema = new mongoose_1.Schema({
    matrix: {
        type: [[Number]],
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("BonusModel", BonusModelSchema);
