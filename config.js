/**
 * Frontend Configuration for MealDB Application
 *
 * Cross-Device Mobile Testing Instructions:
 * ----------------------------------------------------
 * 1. Find your laptop's local Wi-Fi IPv4 address:
 *    - Windows: Run `ipconfig` in Command Prompt (look for "IPv4 Address", e.g., 192.168.1.5)
 *    - macOS / Linux: Run `ipconfig getifaddr en0` or `hostname -I` (e.g., 192.168.1.5)
 *
 * 2. Replace 'localhost' with your laptop's Wi-Fi IP address below:
 *    e.g. export const API_BASE_URL = 'http://192.168.1.5:5000';
 *
 * 3. Ensure both your laptop and mobile device are on the SAME Wi-Fi network.
 * 4. Start the backend: `node server.js`
 * 5. Open http://<laptop-ip>:3000 on your mobile browser.
 */

export const API_BASE_URL = 'http://localhost:5000';

export default {
  API_BASE_URL,
};
