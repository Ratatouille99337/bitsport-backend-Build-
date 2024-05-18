"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFarmEarn = exports.delFarmEarn = exports.getCurrentEarn = exports.getFarmEarn = exports.addFarmEarnTweet = void 0;
const FarmEarn_1 = __importDefault(require("../models/FarmEarn"));
const addFarmEarnTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body", req.body);
    const { content, endTime, tweetType, tweetId, imageLink } = req.body;
    const startTime = Date.now();
    if (endTime <= startTime) {
        return res.status(400).json("Incorrect expire time");
    }
    if (tweetType !== "Farm" && tweetType !== "Booster") {
        return res.status(400).json("Invalid tweet type");
    }
    try {
        // const farmEarn = await FarmEarn.findOne({
        //   endTime: { $gt: startTime },
        // });
        // if (farmEarn) {
        //   return res.status(400).json("There is already tweet for this season");
        // }
        const newFarm = yield new FarmEarn_1.default({
            content,
            startTime,
            endTime,
            tweetType,
            tweetId,
            imageLink,
        }).save();
        return res.json(newFarm);
    }
    catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});
exports.addFarmEarnTweet = addFarmEarnTweet;
const getFarmEarn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const farmEarn = yield FarmEarn_1.default.find({});
    return res.json(farmEarn);
});
exports.getFarmEarn = getFarmEarn;
const getCurrentEarn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const farmEarn = yield FarmEarn_1.default.find({
        startTime: { $lt: Date.now() },
        endTime: { $gt: Date.now() },
    });
    return res.json(farmEarn);
});
exports.getCurrentEarn = getCurrentEarn;
const delFarmEarn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const result = yield FarmEarn_1.default.findByIdAndDelete(id);
        return res.json(result);
    }
    catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});
exports.delFarmEarn = delFarmEarn;
const updateFarmEarn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, content, endTime, tweetType } = req.body;
    try {
        const result = yield FarmEarn_1.default.findByIdAndUpdate(id, {
            content: content,
            endTime: endTime,
            tweetType: tweetType,
        }, { new: true });
        return res.json(result);
    }
    catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});
exports.updateFarmEarn = updateFarmEarn;
