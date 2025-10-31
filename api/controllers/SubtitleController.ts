import { Request, Response } from "express";
import MovieDAO from "../dao/MovieDAO";

// Controlador que maneja la generacion de subtitulos
class SubtitleController {
  // URL de la API de Hugging Face para traducir de ingles a espanol
  private readonly HF_API_URL = "https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-en-es";

  // Clave de acceso a la API de Hugging Face
  private readonly HF_API_KEY = process.env.HUGGINGFACE_API_KEY || "";

  /**
   * @route GET /sb/:id/subtitles/en
   * @description Genera subtitulos en ingles para un video existente.
   */
  async generateEnglish(req: Request, res: Response): Promise<Response> {
    try {
      // Se obtiene el id desde los parametros de la ruta
      const { id } = req.params;

      // Se busca la pelicula en la base de datos por su id
      const movie = await MovieDAO.read(id);

      // Si no existe, se responde con error 404
      if (!movie) {
        return res.status(404).json({ message: "Pelicula no encontrada." });
      }

      // Si no tiene titulo, se devuelve error 400
      if (!movie.title) {
        return res.status(400).json({ 
          message: "La pelicula no tiene titulo disponible." 
        });
      }

      // Se asigna el titulo como subtitulo (en ingles)
      const caption = movie.title as string;

      // Se responde con exito, incluyendo el subtitulo generado
      return res.status(200).json({
        message: "Subtitulo en ingles generado exitosamente.",
        subtitle: caption,
        language: "en"
      });

    } catch (error) {
      // Si ocurre un error inesperado, se captura y se informa
      console.error("Error al generar subtitulos en ingles:", error);
      return res.status(500).json({ 
        message: "Error interno al generar subtitulos." 
      });
    }
  }

  /**
   * @route GET /sb/:id/subtitles/es
   * @description Genera subtitulos en espanol (traducidos desde ingles) para un video existente.
   */
  async generateSpanish(req: Request, res: Response): Promise<Response> {
    try {
      // Se obtiene el id desde los parametros
      const { id } = req.params;

      // Se busca la pelicula en la base de datos
      const movie = await MovieDAO.read(id);

      // Si no se encuentra, se responde con error 404
      if (!movie) {
        return res.status(404).json({ message: "Pelicula no encontrada." });
      }

      // Si la pelicula no tiene titulo, no se puede traducir
      if (!movie.title) {
        return res.status(400).json({ 
          message: "La pelicula no tiene titulo disponible." 
        });
      }

      // Se obtiene el titulo original en ingles
      const originalTitle = movie.title as string;

      // Se traduce el titulo al espanol usando la API de Hugging Face
      const translatedCaption = await this.translateToSpanish(originalTitle);

      // (Opcional) Si la descripcion no es igual a la traduccion, se actualiza en la base de datos
      if (movie.description !== translatedCaption) {
        movie.description = translatedCaption;
        await movie.save();
      }

      // Se devuelve el resultado de la traduccion
      return res.status(200).json({
        message: "Subtitulo en espanol generado exitosamente.",
        subtitle: translatedCaption,
        language: "es",
        original: originalTitle
      });

    } catch (error) {
      // Manejo de errores generales
      console.error("Error al generar subtitulos en espanol:", error);
      return res.status(500).json({ 
        message: "Error interno al generar subtitulos." 
      });
    }
  }

  /**
   * Metodo privado que traduce texto de ingles a espanol usando Hugging Face
   * Modelo utilizado: Helsinki-NLP/opus-mt-en-es
   */
  private async translateToSpanish(text: string): Promise<string> {
    try {
      // Si no hay clave configurada, se avisa y se devuelve el texto original
      if (!this.HF_API_KEY) {
        console.warn("HUGGINGFACE_API_KEY no configurada, usando texto original");
        return text;
      }

      // Se realiza la peticion HTTP POST a la API de Hugging Face
      const response = await fetch(this.HF_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.HF_API_KEY}`, // token de acceso
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: text, // texto a traducir
          options: {
            wait_for_model: true // indica que espere a que el modelo este listo
          }
        })
      });

      // Si la respuesta no es exitosa (status != 200), se lanza un error
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error en Hugging Face API:", errorText);
        throw new Error(`Error de traduccion: ${response.status}`);
      }

      // Se parsea la respuesta JSON
      const data = await response.json();
      
      // Hugging Face devuelve un arreglo con objetos que contienen "translation_text"
      if (data && data[0] && data[0].translation_text) {
        return data[0].translation_text;
      }

      // Si no viene en el formato esperado, se lanza error
      throw new Error("Formato de respuesta inesperado");

    } catch (error) {
      // Si ocurre algun error durante la traduccion, se muestra y se devuelve el texto original
      console.error("Error al traducir con Hugging Face:", error);
      return text;
    }
  }
}

// Se exporta una instancia del controlador
export default new SubtitleController();
