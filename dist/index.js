"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("openai");
const dotenv = __importStar(require("dotenv"));
var similarity = require('compute-cosine-similarity');
dotenv.config();
const configuration = new openai_1.Configuration({
    organization: "org-bJPmrqy1qS5FFLdv07E5b1dF",
    apiKey: process.env.OPENAI_API_KEY,
});
const files = [
    {
        name: "george-washington.txt",
        text: "George Washington was the first president of the United States.",
    },
    {
        name: "john-adams.txt",
        text: "John Adams was the second president of the United States.",
    },
    {
        name: "Chocalate Milkshake.txt",
        text: "Chocolate milkshake is a delicious drink.",
    },
    {
        name: "NASA.txt",
        text: "NASA is an American space agency.",
    },
    {
        name: "Elgato Stream Deck.txt",
        text: "Elgato Stream Deck is a hardware device.",
    },
];
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const openai = new openai_1.OpenAIApi(configuration);
    const query = "twitch.tv";
    const queryResponse = yield openai.createEmbedding({
        model: "text-similarity-babbage-001",
        input: query,
    });
    if (!queryResponse.data.data) {
        console.log("No data returned");
        return;
    }
    const queryEmbedding = queryResponse.data.data[0].embedding;
    const scores = [];
    const fileEmbeddings = [];
    for (const file of files) {
        const response = yield openai.createEmbedding({
            model: "text-similarity-babbage-001",
            input: file.name,
        });
        console.log(response.data);
        // @ts-ignore
        const embedding = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data[0].embedding;
        const similarityScore = similarity(embedding, queryEmbedding);
        scores.push(similarityScore);
        fileEmbeddings.push(response.data);
    }
    const maxScore = Math.max(...scores);
    const maxScoreIndex = scores.indexOf(maxScore);
    console.log(`The most similar file is ${files[maxScoreIndex].name} with a score of ${maxScore}`);
    //   console.log(fileEmbeddings)
});
main();
