import { Request, Response } from "express";
import MovieDAO from "../dao/MovieDAO";

/**
 * Controller responsible for generating subtitles in different languages.
 * It can return English subtitles based on the movie title
 * or translate them into Spanish using the Hugging Face translation API.
 */
class SubtitleController {
  /** Hugging Face translation model URL (English → Spanish). */
  private readonly HF_API_URL =
    "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-es";

  /** Hugging Face API key from environment variables. */
  private readonly HF_API_KEY = process.env.HUGGINGFACE_API_KEY || "";

  /**
   * @route GET /sb/:id/subtitles/en
   * @description Generates English subtitles for an existing movie.
   * @param {Request} req - Express request object containing the movie ID in `req.params.id`.
   * @param {Response} res - Express response object.
   * @returns {Promise<Response>} 200 with the generated English subtitle or an error message.
   * @access Public
   */
  async generateEnglish(req: Request, res: Response): Promise<Response> {
    try {
      // Extract movie ID from route parameters
      const { id } = req.params;

      // Search for the movie in the database
      const movie = await MovieDAO.read(id);

      // If not found, return 404
      if (!movie) {
        return res.status(404).json({ message: "Movie not found." });
      }

      // If no title exists, return 400
      if (!movie.title) {
        return res
          .status(400)
          .json({ message: "The movie does not have a valid title." });
      }

      // Use the movie title as the English subtitle
      const caption = movie.title as string;

      // Return the generated English subtitle
      return res.status(200).json({
        message: "English subtitle generated successfully.",
        subtitle: caption,
        language: "en",
      });
    } catch (error) {
      // Log and handle unexpected errors
      console.error("Error generating English subtitles:", error);
      return res
        .status(500)
        .json({ message: "Internal error generating subtitles." });
    }
  }

  /**
   * @route GET /sb/:id/subtitles/es
   * @description Generates Spanish subtitles by translating the English title using Hugging Face.
   * @param {Request} req - Express request object containing the movie ID in `req.params.id`.
   * @param {Response} res - Express response object.
   * @returns {Promise<Response>} 200 with the translated Spanish subtitle or 500 if an error occurs.
   * @access Public
   */
  async generateSpanish(req: Request, res: Response): Promise<Response> {
    try {
      // Extract movie ID from route parameters
      const { id } = req.params;

      // Find the movie in the database
      const movie = await MovieDAO.read(id);

      // If the movie does not exist, return 404
      if (!movie) {
        return res.status(404).json({ message: "Movie not found." });
      }

      // If the movie has no title, translation cannot proceed
      if (!movie.title) {
        return res
          .status(400)
          .json({ message: "The movie does not have a valid title." });
      }

      // Original movie title (assumed to be in English)
      const originalTitle = movie.title as string;

      // Translate the title from English to Spanish
      const translatedCaption = await this.translateToSpanish(originalTitle);

      // Optionally, update the movie description if it's different from the new translation
      if (movie.description !== translatedCaption) {
        movie.description = translatedCaption;
        await movie.save();
      }

      // Respond with the translated subtitle
      return res.status(200).json({
        message: "Spanish subtitle generated successfully.",
        subtitle: translatedCaption,
        language: "es",
        original: originalTitle,
      });
    } catch (error) {
      // Handle any runtime errors
      console.error("Error generating Spanish subtitles:", error);
      return res
        .status(500)
        .json({ message: "Internal error generating subtitles." });
    }
  }

  /**
   * Translates a given text from English to Spanish using the Hugging Face API.
   * Model used: `Helsinki-NLP/opus-mt-en-es`.
   *
   * @private
   * @param {string} text - The English text to translate.
   * @returns {Promise<string>} The translated text in Spanish, or the original text if an error occurs.
   */
  private async translateToSpanish(text: string): Promise<string> {
    try {
      // Warn if the API key is not configured
      if (!this.HF_API_KEY) {
        console.warn("HUGGINGFACE_API_KEY is not set. Returning original text.");
        return text;
      }

      // Send translation request to Hugging Face
      const response = await fetch(this.HF_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text, // Text to translate
          options: {
            wait_for_model: true, // Wait until the model is ready
          },
        }),
      });

      // If API response is not successful, throw an error
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", errorText);
        throw new Error(`Translation failed with status ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();

      // Hugging Face returns an array with `translation_text` property
      if (data && data[0] && data[0].translation_text) {
        return data[0].translation_text;
      }

      // If format is not as expected, throw an error
      throw new Error("Unexpected response format from Hugging Face API.");
    } catch (error) {
      // Log error and return original text to avoid breaking the flow
      console.error("Error translating text via Hugging Face:", error);
      return text;
    }
  }
}

// Export a single instance of the controller
export default new SubtitleController();
