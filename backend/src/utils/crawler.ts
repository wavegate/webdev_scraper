import puppeteer from "puppeteer";

import fs from "fs";

const jsonFile = "db2.json";
let jsonData: any[] = [];
if (!fs.existsSync(jsonFile)) {
  fs.writeFileSync(jsonFile, JSON.stringify(jsonData), { encoding: "utf-8" });
}

async function getVisual() {
  //   try {
  const URL = "https://www.indeed.com/";
  const browser = await puppeteer.launch({ headless: false });
  //   const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
  );
  await page.goto(URL);

  // Type into search box.
  await page.waitForSelector("#text-input-what");
  await page.type("#text-input-what", "Web developer");
  await page.keyboard.press("Escape");
  const input = await page.$("#text-input-where");
  await input?.click({ clickCount: 3 });
  await page.type("#text-input-where", "Cupertino, CA");
  await page.keyboard.press("Enter");
  // await page.click(".yosegi-InlineWhatWhere-primaryButton");

  let counter = 0;

  while (true) {
    await page.waitForSelector(".resultContent");
    //   const results = await page.$$(".resultContent");
    const results: any[] = await page.$$eval(
      ".resultContent",
      (resultContents) => {
        return resultContents.map((resultContent) => {
          const jobTitle =
            resultContent.querySelector(".jobTitle")?.textContent;
          const jobLink = (
            resultContent.querySelector("a.jcs-JobTitle") as HTMLAnchorElement
          ).href;
          const companyName =
            resultContent.querySelector(".companyName")?.textContent;
          const companyLocation =
            resultContent.querySelector(".companyLocation")?.textContent;
          const attributes = Array.from(
            resultContent.querySelectorAll(".attribute_snippet")
          ).map((attribute) => {
            return attribute.textContent;
          });
          return {
            jobTitle,
            jobLink,
            companyName,
            companyLocation,
            attributes,
          };
        });
      }
    );

    for (let i = 0; i < results.length; i++) {
      counter = counter + 1;
      results[i].counter = counter;
      results[i].pageUrl = page.url();
    }

    console.log(results);

    jsonData = JSON.parse(fs.readFileSync(jsonFile, { encoding: "utf-8" }));
    const appendedData = [...jsonData, ...results];
    fs.writeFileSync(jsonFile, JSON.stringify(appendedData), {
      encoding: "utf-8",
    });

    await page.$eval("a[data-testid='pagination-page-next']", (link) => {
      link.click();
    });
  }

  // await nextPageLink?.click({ delay: 5000 });

  // console.log(results);

  // while (true) {
  //   await page.waitForSelector(".resultContent");
  //   const results = await page.$$(".resultContent");
  //   for (let result of results) {
  //     const printD: { [key: string]: any } = {};
  //     const jobTitle = await page.evaluate(
  //       (el) => el?.querySelector(".jobTitle")?.textContent,
  //       result
  //     );
  //     console.log(jobTitle);
  //     printD.jobTitle = jobTitle;

  //     const companyName = await page.evaluate(
  //       (el) => el?.querySelector(".companyName")?.textContent,
  //       result
  //     );
  //     console.log(companyName);
  //     printD.companyname = companyName;
  //     const companyLocation = await page.evaluate(
  //       (el) => el?.querySelector(".companyLocation")?.textContent,
  //       result
  //     );
  //     console.log(companyLocation);
  //     printD.companyLocation = companyLocation;
  //     // const attributes = await page.evaluate(
  //     //   (el) => el?.querySelectorAll(".attribute_snippet")?.textContent,
  //     //   result
  //     // );
  //     const atts = [];
  //     const attributes = await result.$$(".attribute_snippet");
  //     for (let attribute of attributes) {
  //       const att = await page.evaluate((el) => el.textContent, attribute);
  //       atts.push(att);
  //     }
  //     printD.attributes = atts;
  //     // console.log("JOBNAME:" + jobName);
  //     // printD.name = jobName;
  //     await result.click({ delay: 3000 });
  //     //   console.log(await page.content());

  //     await page.waitForSelector(".jobsearch-jobDescriptionText", {
  //       timeout: 2000,
  //     });
  //     const jobDetail = await page.$(".jobsearch-jobDescriptionText");
  //     const jobDetailText = await page.evaluate(
  //       (el) => el?.textContent,
  //       jobDetail
  //     );
  //     // console.log("JOBDETAIL:" + jobDetailText);
  //     printD.detail = jobDetailText;

  //     jsonData = JSON.parse(fs.readFileSync(jsonFile, { encoding: "utf-8" }));
  //     jsonData.push(printD);
  //     fs.writeFileSync(jsonFile, JSON.stringify(jsonData), {
  //       encoding: "utf-8",
  //     });
  //   }
  //   const nextPageLink = await page.$(
  //     "a[data-testid='pagination-page-next']"
  //   );
  //   await nextPageLink?.click({ delay: 5000 });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
}

getVisual();
