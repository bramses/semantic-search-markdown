import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";
var similarity = require( 'compute-cosine-similarity' );

dotenv.config();

const configuration = new Configuration({
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

const main = async () => {
  const openai = new OpenAIApi(configuration);
    const query = "twitch.tv";
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
    console.log(response.data);
    // @ts-ignore
    const embedding = response.data?.data[0].embedding;
    const similarityScore = similarity(embedding, queryEmbedding);
    scores.push(similarityScore);
    fileEmbeddings.push(response.data);
  }

    const maxScore = Math.max(...scores);
    const maxScoreIndex = scores.indexOf(maxScore);
    console.log(`The most similar file is ${files[maxScoreIndex].name} with a score of ${maxScore}`);


//   console.log(fileEmbeddings)
};

main();
