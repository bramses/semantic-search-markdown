import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
import fs from "fs";
var similarity = require( 'compute-cosine-similarity' );
import { join } from 'path';


dotenv.config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
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
  {
    name: "Golang.txt",
    text: "Go is very fast and easy to learn.",
  }, // every filename adds ~100kb to the bundle size
];


// read a json file and return the data
const readFile = async  (file: string) : Promise<String | NodeJS.ErrnoException> => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

const writeFile = async (file: string, data: string) : Promise<void | NodeJS.ErrnoException> => {
  const filePath = join(__dirname, '..' , 'json' ,file);
  
    return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};




export const main = async (query: string) => {
  const openai = new OpenAIApi(configuration);

    const queryResponse = await openai.createEmbedding({
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
        ...file
    });
  }

  writeFile("fileEmbeddings.json", JSON.stringify(fileEmbeddings, null, 2));

    const maxScore = Math.max(...scores);
    const maxScoreIndex = scores.indexOf(maxScore);
    console.log(`The most similar file is ${files[maxScoreIndex].name} with a score of ${maxScore}`);

//   console.log(fileEmbeddings)
};



main("twitch.tv");
