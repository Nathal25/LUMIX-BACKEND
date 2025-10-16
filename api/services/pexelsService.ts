import { createClient, Videos, ErrorResponse } from "pexels";

const client = createClient(process.env.PEXELS_API_KEY || "");

export const searchVideos = async (query: string, perPage = 10) => {
  const response = await client.videos.search({ query, per_page: perPage });

  if ("videos" in response) {
    return response.videos; 
  } else {
    console.error("Error al buscar videos en Pexels:", (response as ErrorResponse).error);
    throw new Error((response as ErrorResponse).error);
  }
};

export const getPopularVideos = async (perPage = 10) => {
  const response = await client.videos.popular({ per_page: perPage });

  if ("videos" in response) {
    return response.videos;
  } else {
    console.error("Error al obtener videos populares de Pexels:", (response as ErrorResponse).error);
    throw new Error((response as ErrorResponse).error);
  }
};
