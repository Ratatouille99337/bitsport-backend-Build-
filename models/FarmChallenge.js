"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * Create a new Schema from mongoose
 */
const FarmChallengeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    difficulty: { type: Number, required: true },
    streak: { type: Number, required: true },
    amount: { type: Number, required: true },
    index: { type: Number, required: true, default: 0 },
}, { timestamps: true });
/**
 * IFarmChallenge Interface Document class inheritance
 */
exports.default = (0, mongoose_1.model)("FarmChallenge", FarmChallengeSchema);
