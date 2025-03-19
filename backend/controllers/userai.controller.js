import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// Instantiate OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Controller function to fetch vehicle info
export const getVehicleInfo = async (req, res) => {
  try {
    const { vehicleName, model, details } = req.body;

    const prompt = `Provide detailed information about the vehicle ${vehicleName} model ${model}. Include specifications, engine details, fuel efficiency, safety features, and any additional info related to ${details}.`;

    const response = await openai.completions.create({
      model: "gpt-3.5-turbo",
      prompt: prompt,
      max_tokens: 300,
    });

    res.json({ message: response.choices[0].text.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch vehicle information" });
  }
};
