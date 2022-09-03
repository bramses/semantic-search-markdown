import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
var similarity = require("compute-cosine-similarity");
import { addPoints, collectionExists, searchPoints } from "./qdrant-factory";
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


export const main = async (query: string) => {

  // const scores:number[] = [];


  // const queryEmbedding = await embedQuery(openai, query);
  // const fileEmbeddings = await createFilenameEmbeddings(openai, queryEmbedding, scores);

  // writeFile("fileEmbeddings.json", JSON.stringify(fileEmbeddings, null, 2));

  // const maxScore = Math.max(...scores);
  // const maxScoreIndex = scores.indexOf(maxScore);
  // console.log(
  //   `The most similar file is ${files[maxScoreIndex].name} with a score of ${maxScore}`
  // );
};




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




// writeToQDrantCollection(files.map((f) => f.name));

/**embedding for each file and compare score in real time
 * @param openai 
 * @param queryEmbedding 
 * @param scores 
 * @returns 
 */
async function createFilenameEmbeddings(openai: OpenAIApi, queryEmbedding: number[] | undefined, scores: any[]) {
  const fileEmbeddings = [];
  for (const file of files) {
    const response = await openai.createEmbedding({
      model: "text-similarity-babbage-001",
      input: file.name,
    });

    // @ts-ignore
    const embedding = response.data?.data[0].embedding;
    const similarityScore = similarity(embedding, queryEmbedding);
    scores.push(similarityScore);
    fileEmbeddings.push({
      data: response.data,
      ...file,
    });
  }
  return { fileEmbeddings, scores };
}
// main("twitch.tv");
