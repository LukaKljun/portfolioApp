// API Service for fetching real-time prices and searching assets

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const TWELVE_DATA_API = 'https://api.twelvedata.com';

// Helper to add delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Search for cryptocurrencies
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of crypto results
 */
export const searchCrypto = async (query) => {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `${COINGECKO_API}/search?query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    
    return (data.coins || []).slice(0, 10).map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      type: 'crypto',
    }));
  } catch (error) {
    console.error('Error searching crypto:', error);
    return [];
  }
};

/**
 * Get current price for a cryptocurrency
 * @param {string} coinId - CoinGecko coin ID
 * @returns {Promise<number|null>} - Current price in USD
 */
export const getCryptoPrice = async (coinId) => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${coinId}&vs_currencies=usd`
    );
    const data = await response.json();
    
    if (data[coinId] && data[coinId].usd) {
      return data[coinId].usd;
    }
    return null;
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    return null;
  }
};

/**
 * Get crypto price by symbol
 * @param {string} symbol - Crypto symbol (e.g., BTC, ETH)
 * @returns {Promise<number|null>} - Current price in USD
 */
export const getCryptoPriceBySymbol = async (symbol) => {
  try {
    // First search for the coin
    const results = await searchCrypto(symbol);
    if (results.length === 0) return null;
    
    // Get price for the first result
    const coinId = results[0].id;
    return await getCryptoPrice(coinId);
  } catch (error) {
    console.error('Error fetching crypto price by symbol:', error);
    return null;
  }
};

/**
 * Search for stocks and ETFs
 * @param {string} query - Search query (symbol or name)
 * @returns {Promise<Array>} - Array of stock/ETF results
 */
export const searchStock = async (query) => {
  if (!query || query.length < 1) return [];
  
  try {
    // Using Twelve Data free API (requires no API key for basic search)
    const response = await fetch(
      `${TWELVE_DATA_API}/symbol_search?symbol=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    
    if (data.data) {
      return data.data.slice(0, 10).map(stock => ({
        symbol: stock.symbol,
        name: stock.instrument_name || stock.symbol,
        type: stock.instrument_type === 'ETF' ? 'etf' : 'stock',
        exchange: stock.exchange,
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching stocks:', error);
    // Fallback to popular stocks if API fails
    return getFallbackStocks(query);
  }
};

/**
 * Fallback stock list for common symbols
 */
const getFallbackStocks = (query) => {
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock' },
    { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock' },
    { symbol: 'META', name: 'Meta Platforms Inc.', type: 'stock' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'stock' },
    { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', type: 'etf' },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'etf' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'etf' },
  ];
  
  const queryLower = query.toLowerCase();
  return popularStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(queryLower) ||
    stock.name.toLowerCase().includes(queryLower)
  );
};

/**
 * Get current stock price (free API with limitations)
 * @param {string} symbol - Stock symbol (e.g., AAPL)
 * @returns {Promise<number|null>} - Current price in USD
 */
export const getStockPrice = async (symbol) => {
  try {
    // Using Twelve Data free tier
    const response = await fetch(
      `${TWELVE_DATA_API}/price?symbol=${symbol}&apikey=demo`
    );
    const data = await response.json();
    
    if (data.price) {
      return parseFloat(data.price);
    }
    
    // Fallback: Try Yahoo Finance alternative
    return await getStockPriceFallback(symbol);
  } catch (error) {
    console.error('Error fetching stock price:', error);
    return null;
  }
};

/**
 * Fallback method for stock prices
 */
const getStockPriceFallback = async (symbol) => {
  try {
    // Using a public Yahoo Finance API alternative
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`
    );
    const data = await response.json();
    
    if (data.chart?.result?.[0]?.meta?.regularMarketPrice) {
      return data.chart.result[0].meta.regularMarketPrice;
    }
    return null;
  } catch (error) {
    console.error('Error in fallback stock price fetch:', error);
    return null;
  }
};

/**
 * Universal search function that searches all asset types
 * @param {string} query - Search query
 * @param {string} assetType - Type of asset ('stock', 'etf', 'crypto', or 'all')
 * @returns {Promise<Array>} - Combined search results
 */
export const searchAssets = async (query, assetType = 'all') => {
  if (!query || query.length < 1) return [];
  
  const results = [];
  
  try {
    if (assetType === 'crypto' || assetType === 'all') {
      const cryptoResults = await searchCrypto(query);
      results.push(...cryptoResults);
      await delay(100); // Rate limiting
    }
    
    if (assetType === 'stock' || assetType === 'etf' || assetType === 'all') {
      const stockResults = await searchStock(query);
      results.push(...stockResults);
    }
    
    return results;
  } catch (error) {
    console.error('Error in universal search:', error);
    return results;
  }
};

/**
 * Get current price for any asset
 * @param {string} symbol - Asset symbol
 * @param {string} type - Asset type ('stock', 'etf', 'crypto')
 * @param {string} coinId - CoinGecko ID (for crypto)
 * @returns {Promise<number|null>} - Current price in USD
 */
export const getAssetPrice = async (symbol, type, coinId = null) => {
  try {
    if (type === 'crypto') {
      if (coinId) {
        return await getCryptoPrice(coinId);
      }
      return await getCryptoPriceBySymbol(symbol);
    } else {
      // stock or etf
      return await getStockPrice(symbol);
    }
  } catch (error) {
    console.error('Error fetching asset price:', error);
    return null;
  }
};

export default {
  searchCrypto,
  getCryptoPrice,
  getCryptoPriceBySymbol,
  searchStock,
  getStockPrice,
  searchAssets,
  getAssetPrice,
};
