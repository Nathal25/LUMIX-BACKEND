/**
 * @fileoverview Service module for interacting with the Pexels API.
 * Provides functions to search and retrieve videos from Pexels.
 * @module services/pexelsService
 */

import { createClient, Videos, ErrorResponse } from "pexels";

/**
 * Pexels API client instance.
 * Initialized with the API key from environment variables.
 * @constant {PexelsClient}
 */
const client = createClient(process.env.PEXELS_API_KEY || "");

/**
 * Searches for videos on Pexels based on a query string.
 * 
 * @async
 * @function searchVideos
 * @param {string} query - The search query string to find videos.
 * @param {number} [perPage=10] - The number of videos to return per page (default: 10).
 * @returns {Promise<Array>} A promise that resolves to an array of video objects from Pexels.
 * @throws {Error} Throws an error if the Pexels API request fails or returns an error response.
 * @example
 * const videos = await searchVideos("nature", 15);
 * console.log(videos);
 */
export const searchVideos = async (query: string, perPage = 10) => {
  const response = await client.videos.search({ query, per_page: perPage });

  if ("videos" in response) {
    return response.videos; 
  } else {
    console.error("Error al buscar videos en Pexels:", (response as ErrorResponse).error);
    throw new Error((response as ErrorResponse).error);
  }
};

/**
 * Retrieves popular videos from Pexels.
 * 
 * @async
 * @function getPopularVideos
 * @param {number} [perPage=10] - The number of popular videos to return per page (default: 10).
 * @returns {Promise<Array>} A promise that resolves to an array of popular video objects from Pexels.
 * @throws {Error} Throws an error if the Pexels API request fails or returns an error response.
 * @example
 * const popularVideos = await getPopularVideos(20);
 * console.log(popularVideos);
 */
export const getPopularVideos = async (perPage = 10) => {
  const response = await client.videos.popular({ per_page: perPage });

  if ("videos" in response) {
    return response.videos;
  } else {
    console.error("Error al obtener videos populares de Pexels:", (response as ErrorResponse).error);
    throw new Error((response as ErrorResponse).error);
  }
};
