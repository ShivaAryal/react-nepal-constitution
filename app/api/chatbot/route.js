// import { NextResponse } from "next/server";
// import Fuse from "fuse.js";
// import fs from "fs/promises";
// import path from "path";
// import { pipeline } from "@xenova/transformers";

// let embeddingsData = [];

// const loadEmbeddings = async () => {
//   try {
//     const embeddingsFilePath = path.join(
//       process.cwd(),
//       "lib",
//       "embeddings.json"
//     );
//     embeddingsData = JSON.parse(await fs.readFile(embeddingsFilePath, "utf-8"));
//     if (
//       !Array.isArray(embeddingsData) ||
//       !embeddingsData.every(
//         (item) =>
//           item.partNumber &&
//           item.partTitle &&
//           item.articleTitle &&
//           item.language &&
//           Array.isArray(item.embedding)
//       )
//     ) {
//       throw new Error("Invalid embeddings data format");
//     }
//   } catch (error) {
//     console.error("Failed to load embeddings:", error.message);
//     throw new Error("Failed to initialize embeddings data");
//   }
// };

// // Initialize embeddings on module load
// loadEmbeddings().catch((error) => {
//   console.error("Initialization error:", error.message);
// });

// // Fuse.js for fallback search
// const fuseOptions = {
//   keys: ["partTitle", "articleTitle"],
//   threshold: 0.4,
//   includeScore: true,
//   minMatchCharLength: 3,
// };

// // Cosine similarity function
// const cosineSimilarity = (vecA, vecB) => {
//   const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
//   const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
//   const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
//   return dotProduct / (magnitudeA * magnitudeB);
// };

// const capitalizeFirstLetter = (str) => {
//   if (typeof str !== "string" || str.length === 0) {
//     return str;
//   }
//   return str.charAt(0).toUpperCase() + str.slice(1);
// };

// export async function POST(request) {
//   try {
//     let { question, language } = await request.json();
//     language = capitalizeFirstLetter(language);
//     if (!question || !language) {
//       console.error("Empty or invalid request body:", {
//         question,
//         language,
//       });
//       throw new Error("Missing required fields: question and language");
//     }

//     // Validate language
//     const validLanguages = ["English", "Nepali"];
//     if (!validLanguages.includes(language)) {
//       throw new Error("Invalid language. Must be 'English' or 'Nepali'");
//     }

//     // Initialize embedder
//     const embedder = await pipeline(
//       "feature-extraction",
//       "Xenova/all-MiniLM-L6-v2"
//     );

//     // Generate embedding for the question
//     const questionEmbedding = await embedder(question, {
//       pooling: "mean",
//       normalize: true,
//     });
//     const questionVector = Array.from(questionEmbedding.data);

//     // Filter embeddings by language
//     const filteredEmbeddings = embeddingsData.filter(
//       (item) => item.language === language
//     );

//     // Compute cosine similarities
//     const similarities = filteredEmbeddings
//       .map((item) => ({
//         ...item,
//         similarity: cosineSimilarity(questionVector, item.embedding),
//       }))
//       .sort((a, b) => b.similarity - a.similarity);

//     // Get top 5 semantic matches
//     let results = similarities
//       .slice(0, 5)
//       .filter((item) => item.similarity > 0.5) // Threshold for relevance
//       .map((item) => ({
//         partNumber: item.partNumber,
//         partTitle: item.partTitle,
//         articleTitle: item.articleTitle,
//         language: item.language,
//       }));

//     // Fallback to fuzzy search if no results
//     if (results.length === 0) {
//       const fuseData = filteredEmbeddings.map((item) => ({
//         partNumber: item.partNumber,
//         partTitle: item.partTitle,
//         articleTitle: item.articleTitle,
//         language: item.language,
//       }));
//       const fuse = new Fuse(fuseData, fuseOptions);
//       const fuseResults = fuse.search(question);
//       results = fuseResults.slice(0, 5).map(({ item }) => ({
//         partNumber: item.partNumber,
//         partTitle: item.partTitle,
//         articleTitle: item.articleTitle,
//         language: item.language,
//       }));
//     }

//     return NextResponse.json({
//       results,
//       success: true,
//     });
//   } catch (error) {
//     console.error("Chatbot API error:", {
//       error: error.message,
//       requestBody: await request.json().catch(() => ({})),
//     });
//     const status =
//       error.message.includes("Missing required fields") ||
//       error.message.includes("Invalid language")
//         ? 400
//         : 500;
//     return NextResponse.json(
//       {
//         results: [],
//         success: false,
//         error: error.message,
//       },
//       { status }
//     );
//   }
// }

import { NextResponse } from "next/server";
import Fuse from "fuse.js";
import embeddingsData from "../../../lib/embeddings.json"; // Adjust path as needed

// Validate embeddings data at module load
if (
  !Array.isArray(embeddingsData) ||
  !embeddingsData.every(
    (item) =>
      item.partNumber && item.partTitle && item.articleTitle && item.language
  )
) {
  console.error("Invalid embeddings data format");
  throw new Error("Failed to initialize embeddings data");
}

// Fuse.js configuration
const fuseOptions = {
  keys: ["partTitle", "articleTitle"],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 3,
};

const capitalizeFirstLetter = (str) => {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export async function POST(request) {
  try {
    let { question, language } = await request.json();
    language = capitalizeFirstLetter(language);
    if (!question || !language) {
      console.error("Empty or invalid request body:", { question, language });
      throw new Error("Missing required fields: question and language");
    }

    // Validate language
    const validLanguages = ["English", "Nepali"];
    if (!validLanguages.includes(language)) {
      throw new Error("Invalid language. Must be 'English' or 'Nepali'");
    }

    // Filter data by language
    const fuseData = embeddingsData
      .filter((item) => item.language === language)
      .map((item) => ({
        partNumber: item.partNumber,
        partTitle: item.partTitle,
        articleTitle: item.articleTitle,
        language: item.language,
      }));

    // Perform fuzzy search
    const fuse = new Fuse(fuseData, fuseOptions);
    const fuseResults = fuse.search(question);
    const results = fuseResults.slice(0, 5).map(({ item }) => ({
      partNumber: item.partNumber,
      partTitle: item.partTitle,
      articleTitle: item.articleTitle,
      language: item.language,
    }));

    return NextResponse.json({
      results,
      success: true,
    });
  } catch (error) {
    console.error("Chatbot API error:", {
      message: error.message,
      stack: error.stack,
      requestBody: await request.json().catch(() => ({})),
    });
    const status =
      error.message.includes("Missing required fields") ||
      error.message.includes("Invalid language")
        ? 400
        : 500;
    return NextResponse.json(
      {
        results: [],
        success: false,
        error: error.message,
      },
      { status }
    );
  }
}
