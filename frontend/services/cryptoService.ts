
import { CoinPrice } from '../types';

// CoinGecko API Configuration
const COINGECKO_API_URL = import.meta.env.VITE_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3';
const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY || '';

/**
 * Builds API URL with optional API key for premium tier
 */
const buildApiUrl = (endpoint: string, params: Record<string, string>): string => {
  const url = new URL(`${COINGECKO_API_URL}${endpoint}`);

  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  // Add API key if configured (for CoinGecko Pro)
  if (COINGECKO_API_KEY) {
    url.searchParams.append('x_cg_pro_api_key', COINGECKO_API_KEY);
  }

  return url.toString();
};

/**
 * Fetch current prices for multiple cryptocurrencies
 * @param ids - Array of CoinGecko coin IDs (e.g., ['bitcoin', 'ethereum'])
 * @returns Record of coin IDs to their current USD prices
 */
export const fetchPrices = async (ids: string[]): Promise<Record<string, number>> => {
  try {
    const url = buildApiUrl('/simple/price', {
      ids: ids.join(','),
      vs_currencies: 'usd'
    });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    const prices: Record<string, number> = {};
    Object.keys(data).forEach(id => {
      prices[id] = data[id].usd;
    });

    return prices;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return {};
  }
};

/**
 * Search for cryptocurrencies by name or symbol
 * @param query - Search query (minimum 2 characters)
 * @returns Array of matching coins (limited to 10 results)
 */
export const searchCoins = async (query: string): Promise<CoinPrice[]> => {
  if (!query || query.length < 2) return [];

  try {
    const url = buildApiUrl('/search', { query });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    return data.coins.slice(0, 10).map((c: any) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
      current_price: 0, // Search API doesn't return price
    }));
  } catch (error) {
    console.error('Error searching coins:', error);
    return [];
  }
};
