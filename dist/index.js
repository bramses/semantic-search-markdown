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
exports.main = void 0;
const openai_1 = require("openai");
const dotenv = __importStar(require("dotenv"));
var similarity = require("compute-cosine-similarity");
const qdrant_factory_1 = require("./qdrant-factory");
dotenv.config();
const configuration = new openai_1.Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
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
    {
        name: "Golang.txt",
        text: "Go is very fast and easy to learn.",
    }, // every filename adds ~100kb to the bundle size
];
/**
 *
 * @param openai accept a sile string and return a vector embedding
 * @param query
 * @param model
 * @returns
 */
const createEmbeddings = (openai, query, model = "text-similarity-babbage-001") => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield openai.createEmbedding({
            model: model,
            input: query,
        });
        if (!response.data.data) {
            console.log("No data returned");
            return;
        }
        return response.data.data;
    }
    catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        }
        else {
            console.log(error.message);
        }
    }
});
const main = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // const scores:number[] = [];
    // const queryEmbedding = await embedQuery(openai, query);
    // const fileEmbeddings = await createFilenameEmbeddings(openai, queryEmbedding, scores);
    // writeFile("fileEmbeddings.json", JSON.stringify(fileEmbeddings, null, 2));
    // const maxScore = Math.max(...scores);
    // const maxScoreIndex = scores.indexOf(maxScore);
    // console.log(
    //   `The most similar file is ${files[maxScoreIndex].name} with a score of ${maxScore}`
    // );
});
exports.main = main;
const collectionName = "test";
const writeToQDrantCollection = (filenames) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Writing to QDrant collection");
    if (!(yield (0, qdrant_factory_1.collectionExists)(collectionName))) {
        throw new Error("Collection does not exist");
    }
    const data = yield createEmbeddings(openai, filenames);
    const points = data === null || data === void 0 ? void 0 : data.map((d, i) => {
        return {
            id: i,
            embedding: d.embedding,
            filename: filenames[i],
        };
    });
    const qdrantFormattedPoints = points === null || points === void 0 ? void 0 : points.map((p) => {
        return {
            id: p.id,
            vector: p.embedding,
            payload: {
                filename: p.filename
            }
        };
    });
    if (qdrantFormattedPoints) {
        const res = yield (0, qdrant_factory_1.addPoints)(collectionName, qdrantFormattedPoints);
        console.log(res);
    }
});
// writeToQDrantCollection(files.map((f) => f.name));
/**embedding for each file and compare score in real time
 * @param openai
 * @param queryEmbedding
 * @param scores
 * @returns
 */
function createFilenameEmbeddings(openai, queryEmbedding, scores) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const fileEmbeddings = [];
        for (const file of files) {
            const response = yield openai.createEmbedding({
                model: "text-similarity-babbage-001",
                input: file.name,
            });
            // @ts-ignore
            const embedding = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data[0].embedding;
            const similarityScore = similarity(embedding, queryEmbedding);
            scores.push(similarityScore);
            fileEmbeddings.push(Object.assign({ data: response.data }, file));
        }
        return { fileEmbeddings, scores };
    });
}
// main("twitch.tv");
