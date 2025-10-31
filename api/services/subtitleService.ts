// import axios, { AxiosResponse } from "axios";
// import fs from "fs";

// const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_API_KEY || "";

// // Interfaz del tipo de respuesta esperada del modelo
// interface HuggingFaceResponse {
//   generated_text: string;
// }

// /**
//  * Genera una descripción (subtítulo) para una imagen local.
//  * @param imagePath Ruta local del archivo de imagen.
//  * @returns Subtítulo generado o `null` si ocurre un error.
//  */
// export async function generateImageCaption(imagePath: string): Promise<string | null> {
//   try {
//     if (!HUGGINGFACE_TOKEN) {
//       throw new Error("Token de Hugging Face no configurado.");
//     }

//     if (!fs.existsSync(imagePath)) {
//       throw new Error(`El archivo no existe: ${imagePath}`);
//     }

//     const imageData = fs.readFileSync(imagePath);

//     // Se usa el endpoint correcto del modelo alojado en HF Inference API
//     const response: AxiosResponse<HuggingFaceResponse[]> = await axios.post(
//       "https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning",
//       imageData,
//       {
//         headers: {
//           Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
//           "Content-Type": "application/octet-stream",
//         },
//       }
//     );

//     const caption = response.data?.[0]?.generated_text ?? "No se pudo generar subtítulo.";
//     console.log("📝 Subtítulo generado:", caption);

//     return caption;
//   } catch (error: any) {
//     console.error("❌ Error al generar subtítulo:", error.response?.data || error.message);
//     return null;
//   }
// }

import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

ffmpeg.setFfmpegPath(ffmpegPath!);

const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_API_KEY || "";

/**
 * Intenta múltiples modelos hasta encontrar uno que funcione
 */
async function analyzeFrame(imagePath: string): Promise<string> {
  const models = [
    "Salesforce/blip-image-captioning-base",
    "microsoft/git-base",
    "nlpconnect/vit-gpt2-image-captioning",
  ];

  const imageBuffer = fs.readFileSync(imagePath);

  for (const model of models) {
    try {
      console.log(`Intentando con modelo: ${model}`);
      
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        imageBuffer,
        {
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
            "Content-Type": "application/octet-stream",
          },
          timeout: 30000, // 30 segundos de timeout
        }
      );

      const caption = response.data[0]?.generated_text || response.data?.generated_text;
      if (caption) {
        console.log(`✅ Éxito con ${model}: ${caption}`);
        return caption;
      }
    } catch (error: any) {
      console.error(`❌ Error con ${model}:`, error.response?.status, error.response?.data);
      
      // Si es 503, el modelo está cargando
      if (error.response?.status === 503) {
        console.log("Modelo cargando, esperando 15 segundos...");
        await new Promise(resolve => setTimeout(resolve, 15000));
        
        // Reintentar el mismo modelo una vez
        try {
          const retryResponse = await axios.post(
            `https://api-inference.huggingface.co/models/${model}`,
            imageBuffer,
            {
              headers: {
                Authorization: `Bearer ${HUGGINGFACE_TOKEN}`,
                "Content-Type": "application/octet-stream",
              },
            }
          );
          const caption = retryResponse.data[0]?.generated_text || retryResponse.data?.generated_text;
          if (caption) return caption;
        } catch (retryError) {
          console.error("Reintento fallido");
        }
      }
      
      // Continuar con el siguiente modelo
      continue;
    }
  }

  return "Sin descripción disponible";
}

/**
 * Extrae frames del video temporalmente usando ffmpeg.
 */
function extractFrames(videoUrl: string, outputDir: string, fps = 0.1): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    ffmpeg(videoUrl)
      .outputOptions([`-vf fps=${fps}`])
      .output(path.join(outputDir, "frame-%03d.jpg"))
      .on("end", () => resolve())
      .on("error", (err) => reject(err))
      .run();
  });
}

/**
 * Formatea segundos → hh:mm:ss,000
 */
function formatTime(sec: number): string {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return `${h}:${m}:${s},000`;
}

/**
 * Genera subtítulos descriptivos (.srt) a partir de un video.
 */
export async function generateSubtitlesFromVideo(videoUrl: string): Promise<string> {
  const outputDir = path.join(__dirname, "../../temp_frames");
  
  try {
    console.log("Extrayendo frames del video...");
    await extractFrames(videoUrl, outputDir, 0.1); // cada 10 segundos

    const frames = fs.readdirSync(outputDir).filter((f) => f.endsWith(".jpg"));
    console.log(`Se extrajeron ${frames.length} frames`);
    
    if (frames.length === 0) {
      throw new Error("No se pudieron extraer frames del video");
    }
    
    const captions: { start: number; end: number; text: string }[] = [];

    for (const [index, frame] of frames.entries()) {
      console.log(`Analizando frame ${index + 1}/${frames.length}...`);
      const imagePath = path.join(outputDir, frame);
      const description = await analyzeFrame(imagePath);
      const start = index * 10;
      const end = start + 10;
      captions.push({ start, end, text: description });
      
      // Pausa para no saturar la API
      if (index < frames.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Armar el .srt
    const srt = captions
      .map(
        (c, i) =>
          `${i + 1}\n${formatTime(c.start)} --> ${formatTime(c.end)}\n${c.text}\n`
      )
      .join("\n");

    return srt;
  } catch (error) {
    console.error("Error generando subtítulos:", error);
    throw error;
  } finally {
    // Limpieza
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  }
}