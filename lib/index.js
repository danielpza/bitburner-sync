import * as http from "node:http";

const BB_CONFIG = {
  port: 9990,
  url: "localhost",
  filePostURI: "/",
  authToken: "",
};

/**
 * Show a toast/notification to the user.
 *
 * @param {string} message The message to be in the toast
 */
const showToast = (message) => {
  console.log(message);
};

/** @param {string} filename */
function sanitizeFilename(filename) {
  // If the file is going to be in a director, it NEEDS the leading "/", i.e. "/my-dir/file.js"
  // If the file is standalone, it CAN NOT HAVE a leading slash, i.e. "file.js"
  // The game will not accept the file and/or have undefined behaviour otherwise...
  const clean = filename.replace(/[\\|/]+/g, "/");
  if (/\//.test(clean)) {
    return `/${clean}`;
  }
  return clean;
}

/**
 * Make a POST request to the expected port of the game
 *
 * @param {{
 *   filename: string;
 *   code: string;
 * }} payload
 *   The payload to send to the game client
 * @param {{ AUTH_TOKEN: string }} config
 */
export const uploadFile = (payload, config) => {
  const cleanPayload = {
    filename: sanitizeFilename(payload.filename),
    code: Buffer.from(payload.code).toString("base64"),
  };

  const stringPayload = JSON.stringify(cleanPayload);
  const options = {
    hostname: BB_CONFIG.url,
    port: BB_CONFIG.port,
    path: BB_CONFIG.filePostURI,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": stringPayload.length,
      Authorization: `Bearer ${config.AUTH_TOKEN}`,
    },
  };

  const req = http.request(options, (res) => {
    res.on("data", (d) => {
      const responseBody = Buffer.from(d).toString();

      switch (res.statusCode) {
        case 200:
          showToast(`${cleanPayload.filename} has been uploaded!`);
          break;
        case 401:
          showToast(
            `Failed to push ${cleanPayload.filename} to the game!\n${responseBody}`
          );
          break;
        default:
          showToast(
            `File failed to push, statusCode: ${res.statusCode} | message: ${responseBody}`
          );
          break;
      }
    });
  });

  req.write(stringPayload);
  req.end();
};
