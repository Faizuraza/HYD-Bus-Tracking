
import API_BASE_URL from "../config/api";

/**
 * Searches stops by a partial text query.
 * @param {string} query 
 * @returns {Promise<Array>}
 */
export async function searchStops(query) {
  const response = await fetch(`${API_BASE_URL}/api/stops/search?query=${encodeURIComponent(query)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}: Failed to search stops.`);
  }
  return data;
}

/**
 * Searches direct routes between source and destination stops.
 * @param {string} from 
 * @param {string} to 
 * @returns {Promise<Array>}
 */
export async function searchRoutes(from, to) {
  const response = await fetch(`${API_BASE_URL}/api/routes/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}: Failed to search direct routes.`);
  }
  return data;
}

/**
 * Searches transfer routes between source and destination stops when direct is not available.
 * @param {string} from 
 * @param {string} to 
 * @returns {Promise<Object>}
 */
export async function fetchTransferJourney(from, to) {
  const response = await fetch(`${API_BASE_URL}/api/transfers/journey?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}: Failed to search transfer journey.`);
  }
  return data;
}

/**
 * Fetches ordered stops coordinates for a given route number.
 * @param {string} routeNumber 
 * @returns {Promise<Object>}
 */
export async function fetchRouteDetails(routeNumber) {
  const response = await fetch(`${API_BASE_URL}/api/routes/${encodeURIComponent(routeNumber)}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}: Failed to load route details.`);
  }
  return data;
}

/**
 * Fetches ETA details for the nearest bus on a route to a specific stop.
 * @param {string} stopName 
 * @param {string} routeNumber 
 * @returns {Promise<Object>}
 */
export async function fetchNearestBusETA(stopName, routeNumber) {
  const response = await fetch(
    `${API_BASE_URL}/api/eta/nearest-bus?stopName=${encodeURIComponent(stopName)}&routeNumber=${encodeURIComponent(routeNumber)}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}: Failed to load live ETA details.`);
  }
  return data;
}
