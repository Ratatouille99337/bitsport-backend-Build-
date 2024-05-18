"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FarmEarnSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    startTime: {
        type: Number,
        required: true,
    },
    endTime: {
        type: Number,
        required: true,
    },
    tweetType: {
        type: String,
        default: "Farm",
    },
    tweetId: {
        type: String,
        required: true,
    },
    imageLink: {
        type: String,
    },
    mainContent: {
        type: String,
        default: "",
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("FarmEarn", FarmEarnSchema);
