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
exports.searchPoints = exports.addPoints = exports.collectionExists = exports.createCollection = void 0;
const axios_1 = __importDefault(require("axios"));
// create collection
/*
curl -X PUT 'http://localhost:6333/collections/test_collection' \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "vector_size": 4,
        "distance": "Dot"
    }'
*/
function createCollection(collectionName, vectorSize, distance) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `http://localhost:6333/collections/${collectionName}`;
        const data = {
            vector_size: vectorSize,
            distance: distance
        };
        const response = yield axios_1.default.put(url, data);
        return response.data;
    });
}
exports.createCollection = createCollection;
// test if collection exists
/*
curl 'http://localhost:6333/collections/test_collection'
*/
function collectionExists(collectionName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `http://localhost:6333/collections/${collectionName}`;
            const response = yield axios_1.default.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return true;
        }
        catch (err) {
            if (err.response.status == 404) {
                return false;
            }
        }
    });
}
exports.collectionExists = collectionExists;
// add points to collection
/*
curl -L -X PUT 'http://localhost:6333/collections/test_collection/points?wait=true' \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "points": [
          {"id": 1, "vector": [0.05, 0.61, 0.76, 0.74], "payload": {"city": "Berlin" }},
          {"id": 2, "vector": [0.19, 0.81, 0.75, 0.11], "payload": {"city": ["Berlin", "London"] }},
          {"id": 3, "vector": [0.36, 0.55, 0.47, 0.94], "payload": {"city": ["Berlin", "Moscow"] }},
          {"id": 4, "vector": [0.18, 0.01, 0.85, 0.80], "payload": {"city": ["London", "Moscow"] }},
          {"id": 5, "vector": [0.24, 0.18, 0.22, 0.44], "payload": {"count": [0] }},
          {"id": 6, "vector": [0.35, 0.08, 0.11, 0.44]}
        ]
    }'
*/
function addPoints(collectionName, points) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `http://localhost:6333/collections/${collectionName}/points?wait=true`;
        const data = {
            points: points
        };
        const response = yield axios_1.default.put(url, data);
        return response.data;
    });
}
exports.addPoints = addPoints;
// search points with query and an optional filter
/*
curl -L -X POST 'http://localhost:6333/collections/test_collection/points/search' \
    -H 'Content-Type: application/json' \
    --data-raw '{
      "filter": {
          "should": [
              {
                  "key": "city",
                  "match": {
                      "value": "London"
                  }
              }
          ]
      },
      "vector": [0.2, 0.1, 0.9, 0.7],
      "top": 3
  }'
*/
function searchPoints(collectionName, vector, top, filter) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `http://localhost:6333/collections/${collectionName}/points/search`;
        const data = {
            vector: vector,
            top: top,
        };
        if (filter) {
            data["filter"] = filter;
        }
        const response = yield axios_1.default.post(url, data);
        return response.data;
    });
}
exports.searchPoints = searchPoints;
