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
exports.createContent = exports.getContent = void 0;
const PreConte_1 = __importDefault(require("../models/PreConte"));
const getContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield PreConte_1.default.find({});
        return res.json(result);
    }
    catch (e) {
        console.error(e);
    }
});
exports.getContent = getContent;
const createContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { content } = req.body;
        const count = yield PreConte_1.default.find({});
        if (count.length) {
            const result = yield PreConte_1.default.findByIdAndUpdate(count[0]._id, {
                content: content,
            });
        }
        else {
            const result = yield PreConte_1.default.findOneAndUpdate({ content: content }, { content: content }, { upsert: true });
        }
        return res.json({ status: 'success' });
    }
    catch (e) {
        console.error(e);
    }
});
exports.createContent = createContent;
