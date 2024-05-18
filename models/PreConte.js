"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PreContentSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("PreContent", PreContentSchema);
