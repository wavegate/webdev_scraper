"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get("/data", (req, res) => {
    const data = JSON.parse(fs_1.default.readFileSync("dist/utils/db.json", { encoding: "utf-8" }));
    return res.json({ data: data });
});
exports.default = app;
app.listen(8000, () => {
    console.log("server ready");
});
