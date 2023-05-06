import puppeteer from "puppeteer";

import fs from "fs";

const inFile = "db2.json";
const outFile = "specifics2.json";
let jsonData: any[] = [];
let data: { [key: string]: string }[] | null = null;
if (fs.existsSync(inFile)) {
  data = JSON.parse(fs.readFileSync(inFile, { encoding: "utf-8" }));
}

if (!fs.existsSync(outFile)) {
  fs.writeFileSync(outFile, JSON.stringify(jsonData), { encoding: "utf-8" });
}

async function getData() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
    );
    for (let i = 859; i < data!.length; i++) {
      const link = data![i].jobLink;
      await page.goto(link);

      try {
        await page.waitForSelector("#jobDescriptionText", { timeout: 12000 });
        const description = await page.$eval(
          "#jobDescriptionText",
          (descriptionElement) => {
            return descriptionElement.textContent;
          }
        );
        jsonData = JSON.parse(fs.readFileSync(outFile, { encoding: "utf-8" }));
        const appendedData = [
          ...jsonData,
          { index: i, jobLink: link, jobDescription: description },
        ];
        fs.writeFileSync(outFile, JSON.stringify(appendedData), {
          encoding: "utf-8",
        });
        console.log("INDEX: " + i);
      } catch (error) {
        console.log(error);
        continue;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

getData();

// async function getVisual() {
//   //   try {
//   const URL = "https://www.indeed.com/";
//   const browser = await puppeteer.launch({ headless: false });
//   //   const browser = await puppeteer.launch({ headless: true });

//   const page = await browser.newPage();
//   await page.setUserAgent(
//     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
//   );
//   await page.goto(URL);

//   // Type into search box.
//   await page.waitForSelector("#text-input-what");
//   await page.type("#text-input-what", "Web developer");
//   await page.keyboard.press("Escape");
//   await page.click(".yosegi-InlineWhatWhere-primaryButton");

//   let counter = 0;

//   while (true) {
//     await page.waitForSelector(".resultContent");
//     //   const results = await page.$$(".resultContent");
//     const results: any[] = await page.$$eval(
//       ".resultContent",
//       (resultContents) => {
//         return resultContents.map((resultContent) => {
//           const jobTitle =
//             resultContent.querySelector(".jobTitle")?.textContent;
//           const jobLink = (
//             resultContent.querySelector("a.jcs-JobTitle") as HTMLAnchorElement
//           ).href;
//           const companyName =
//             resultContent.querySelector(".companyName")?.textContent;
//           const companyLocation =
//             resultContent.querySelector(".companyLocation")?.textContent;
//           const attributes = Array.from(
//             resultContent.querySelectorAll(".attribute_snippet")
//           ).map((attribute) => {
//             return attribute.textContent;
//           });
//           return {
//             jobTitle,
//             jobLink,
//             companyName,
//             companyLocation,
//             attributes,
//           };
//         });
//       }
//     );

//     for (let i = 0; i < results.length; i++) {
//       counter = counter + 1;
//       results[i].counter = counter;
//       results[i].pageUrl = page.url();
//     }

//     console.log(results);

//     jsonData = JSON.parse(fs.readFileSync(jsonFile, { encoding: "utf-8" }));
//     const appendedData = [...jsonData, ...results];
//     fs.writeFileSync(jsonFile, JSON.stringify(appendedData), {
//       encoding: "utf-8",
//     });

//     await page.$eval("a[data-testid='pagination-page-next']", (link) => {
//       link.click();
//     });
//   }
// }

// getVisual();
