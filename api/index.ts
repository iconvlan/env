import express from "express";
import z, { ZodError } from "zod";
import sheets from "./sheetClient";

const app = express();

const contactFormSchema = z.array(
  z.object({
    date: z.string(),
    employeeName: z.string().min(1, { message: "Employee Name is required" }),
    shift: z.string().min(1, { message: "Shift is required" }),
    analisa: z.string().min(1, { message: "Analisa is required" }),
    idTiket: z.string().min(1, { message: "ID Tiket is required" }),
  })
);

app.use(express.json());
app.use(express.static("public"));
console.log(process.env.SHEET_ID)
app.post("/shift-data", async (req: any, res: any) => {
  try {
    const body = contactFormSchema.safeParse(req.body);

    let rowData: string[][] = [];
    
    if (body.success) {
      rowData = body.data.map((item) => Object.values(item));

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID,
        range: "Form Responses 1!A2:E",
        insertDataOption: "INSERT_ROWS",
        valueInputOption: "RAW",
        requestBody: { values: rowData },
      });

      res.json({ message: "Data added successfully", statusCode: 200 });
    } else {
      res.status(400).json({ message: "Invalid Format Data", statusCode: 400 });
      console.error("Validation errors:", body.error.errors);
    }
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.message });
    } else {
      console.log(error)
      res.status(400).json({ error });
    }
  }
});

app.get("/", (req: any, res: any) => res.send("Express on Vercel"));

app.listen(4000, () => console.log("Server ready on port 4000."));

module.exports = app;
