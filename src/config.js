/**
 * Frontend Configuration for MealDB Application
 *
 * Cross-Device Mobile Testing Instructions:
 * ----------------------------------------------------
 * 1. Find your laptop's local Wi-Fi IPv4 address:
 *    - Windows: Run `ipconfig` in Command Prompt (look for "IPv4 Address", e.g., 192.168.1.5)
 *    - macOS / Linux: Run `ipconfig getifaddr en0` or `hostname -I` (e.g., 192.168.1.5)
 *
 * 2. In this file, change `API_BASE_URL`:
 *    Replace:
 *      export const API_BASE_URL = 'http://localhost:5000';
 *    With your laptop's Wi-Fi IP and port 5000:
 *      export const API_BASE_URL = 'http://192.168.1.5:5000';
 *
 * 3. Verify your phone and laptop are on the SAME Wi-Fi network.
 * 4. Ensure your laptop's backend server is running: `node server.js`
 * 5. Ensure your laptop firewall allows incoming connections on port 5000.
 */

// CHANGE THIS LINE to your laptop Wi-Fi IP when accessing from a mobile phone:
// Example: export const API_BASE_URL = "http://192.168.1.5:5000";
export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) ||
  'http://localhost:5000';

export default {
  API_BASE_URL,
};
