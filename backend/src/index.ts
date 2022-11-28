import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/data", (req: Request, res: Response) => {
  const data = JSON.parse(
    fs.readFileSync("dist/utils/db.json", { encoding: "utf-8" })
  );
  return res.json({ data: data });
});
export default app;

app.listen(8000, () => {
  console.log("server ready");
});
