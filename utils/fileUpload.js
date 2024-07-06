import fs from "fs";
import { google } from "googleapis";

const apikeys2 = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.slice(1, -1),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
};
const SCOPE = ["https://www.googleapis.com/auth/drive"];

async function authorize() {
  const jwtClient = new google.auth.JWT(
    apikeys2.client_email,
    null,
    apikeys2.private_key,
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
