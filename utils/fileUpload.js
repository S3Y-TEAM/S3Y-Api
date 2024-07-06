import fs from "fs";
import { google } from "googleapis";

import apikeys from "../apikeys.json" assert { type: "json" };
const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorize() {
  const jwtClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    SCOPE
  );
  await jwtClient.authorize();
  return jwtClient;
}

async function uploadToDrive(authClient, fileData) {
  const drive = google.drive({ version: "v3", auth: authClient });

  const response = await drive.files.create({
    requestBody: {
      name: fileData.filename,
      mimeType: fileData.mimetype,
      parents: ["1gYhuTTbXQrdKueUxwRDpzZXbXhPQs7oe"],
    },
    media: {
      mimeType: fileData.mimetype,
      body: fs.createReadStream(fileData.filepath),
    },
    fields: "id, webViewLink, webContentLink",
  });

  fs.unlinkSync(fileData.filepath);
  response.data.webContentLink = response.data.webContentLink.replace(
    /&export=download$/,
    "&export=view"
  );

  return response.data;
}

async function handler(req, res) {
  if (req.method === "POST" && req.file) {
    const file = req.file;
    const fileData = {
      filepath: file.path,
      mimetype: file.mimetype,
      filename: file.originalname,
    };

    try {
      const authClient = await authorize();
      const uploadResponse = await uploadToDrive(authClient, fileData);
      return uploadResponse;
    } catch (error) {
      console.error("Error uploading to Google Drive:", error);
      return null;
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export { handler };
