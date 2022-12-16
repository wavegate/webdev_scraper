import fs from "fs";

const keywords = ["React", "Redux", "Vue", "Angular"];

const inFile = "cut.json";
const outFile = "cut.json";
let jsonData: any[] = [];
let data: { [key: string]: string }[] | null = null;
if (fs.existsSync(inFile)) {
  data = JSON.parse(fs.readFileSync(inFile, { encoding: "utf-8" }));
}

if (!fs.existsSync(outFile)) {
  fs.writeFileSync(outFile, JSON.stringify(jsonData), { encoding: "utf-8" });
}

// console.log(data);

for (let i = 0; i < data!.length; i++) {
  const description = data![i].jobDescription;
  const foundKeywords = keywords.filter((keyword) => {
    return description.includes(keyword);
  });
  console.log("INDEX: " + data![i].index, i);
  console.log("DESCRIPTION: " + description);
  console.log("KEYWORDS: " + foundKeywords);
}

// const appendedData = data!.filter((data, index) => index < 537 || index > 681);
// appendedData.map((data) => console.log(data.index));
// fs.writeFileSync(outFile, JSON.stringify(appendedData), {
//   encoding: "utf-8",
// });
