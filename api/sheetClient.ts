import { google } from "googleapis";

// import key from "../secrets.json" assert { type: "json" };

const client = new google.auth.JWT(process.env.client_email, undefined, process.env.private_key?.replace(/\\n/g, "\n"), [
  "https://www.googleapis.com/auth/spreadsheets",
]);

const sheets = google.sheets({ version: 'v4', auth: client})

export default sheets