import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
var similarity = require("compute-cosine-similarity");
import { addPoints, collectionExists, searchPoints, scrollPoints } from "./qdrant-factory";
import { writeFile } from "./writeFile";
import { zip } from "lodash";

dotenv.config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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
const createEmbeddings = async (openai: OpenAIApi, query: string[], model = "text-similarity-babbage-001") => {
  try {
    const response = await openai.createEmbedding({
      model: model,
      input: query,
    });
  
    if (!response.data.data) {
      console.log("No data returned");
      return;
    }
  
    return response.data.data;
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

const collectionName = "test";

const writeToQDrantCollection = async (filenames: string[]) => {
  console.log("Writing to QDrant collection");  
  if (!await collectionExists(collectionName)) {
    throw new Error("Collection does not exist");
  }

  const data = await createEmbeddings(openai, filenames);
  const points = data?.map((d: any, i: number) => {
    return {
      id: i,
      embedding: d.embedding,
      filename: filenames[i],
    };
  })

  const qdrantFormattedPoints = points?.map((p: any) => {
    return {
      id: p.id,
      vector: p.embedding,
      payload: {
        filename: p.filename
      }
    }
  })

  if (qdrantFormattedPoints) {
    const res = await addPoints(collectionName, qdrantFormattedPoints);
    console.log(res);
  }
};

const searchQDrantCollection = async (query: string) => {
  console.log("Searching QDrant collection");
  if (!await collectionExists(collectionName)) {
    throw new Error("Collection does not exist");
  }

  const queryEmbedding = await createEmbeddings(openai, [query]);
  const queryVector = queryEmbedding?.[0].embedding;
  
  if (queryVector) {
    const res = await searchPoints(collectionName, queryVector, 2);
    console.log(res);
    console.log(res.result[0].payload.filename);
  }
};

const findQDrantIDByFilename = async (filename: string) => {
  console.log("Searching QDrant collection");
  if (!await collectionExists(collectionName)) {
    throw new Error("Collection does not exist");
  }

  const res = await scrollPoints(collectionName, filename);
  console.log(res.result.points);
}

findQDrantIDByFilename("Chocalate Milkshake.txt");

// searchQDrantCollection("programming language");
// writeToQDrantCollection(files.map((f) => f.name));
