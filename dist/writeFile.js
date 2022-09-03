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
exports.writeFile = exports.readFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
// read a json file and return the data
const readFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(file, "utf8", (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
});
exports.readFile = readFile;
const writeFile = (file, data) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = (0, path_1.join)(__dirname, "..", "json", file);
    return new Promise((resolve, reject) => {
        fs_1.default.writeFile(filePath, data, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
});
exports.writeFile = writeFile;
