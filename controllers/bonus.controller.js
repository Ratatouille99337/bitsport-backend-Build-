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
exports.saveBonus = exports.getBonus = void 0;
const BonusModel_1 = __importDefault(require("../models/BonusModel"));
const getBonus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield BonusModel_1.default.find({});
        return res.json(result);
    }
    catch (e) {
        console.error('Get Bonus Error\n--------------------------\n', e);
    }
});
exports.getBonus = getBonus;
const saveBonus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { matrix } = req.body;
        const count = yield BonusModel_1.default.find({});
        if (count.length) {
            const result = yield BonusModel_1.default.findByIdAndUpdate(count[0]._id, {
                matrix: matrix,
            });
        }
        else {
            const result = yield BonusModel_1.default.findOneAndUpdate({ matrix: matrix }, { matrix: matrix }, { upsert: true });
        }
        return res.json({ status: 'success' });
    }
    catch (e) {
        console.error('Save Bonus Error\n---------------------------\n', e);
    }
});
exports.saveBonus = saveBonus;
