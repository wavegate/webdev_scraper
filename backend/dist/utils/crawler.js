"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const fs_1 = __importDefault(require("fs"));
const jsonFile = "db2.json";
let jsonData = [];
if (!fs_1.default.existsSync(jsonFile)) {
    fs_1.default.writeFileSync(jsonFile, JSON.stringify(jsonData), { encoding: "utf-8" });
}
function getVisual() {
    return __awaiter(this, void 0, void 0, function* () {
        //   try {
        const URL = "https://www.indeed.com/";
        const browser = yield puppeteer_1.default.launch({ headless: false });
        //   const browser = await puppeteer.launch({ headless: true });
        const page = yield browser.newPage();
        yield page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36");
        yield page.goto(URL);
        // Type into search box.
        yield page.waitForSelector("#text-input-what");
        yield page.type("#text-input-what", "Web developer");
        yield page.keyboard.press("Escape");
        const input = yield page.$("#text-input-where");
        yield (input === null || input === void 0 ? void 0 : input.click({ clickCount: 3 }));
        yield page.type("#text-input-where", "Cupertino, CA");
        yield page.keyboard.press("Enter");
        // await page.click(".yosegi-InlineWhatWhere-primaryButton");
        let counter = 0;
        while (true) {
            yield page.waitForSelector(".resultContent");
            //   const results = await page.$$(".resultContent");
            const results = yield page.$$eval(".resultContent", (resultContents) => {
                return resultContents.map((resultContent) => {
                    var _a, _b, _c;
                    const jobTitle = (_a = resultContent.querySelector(".jobTitle")) === null || _a === void 0 ? void 0 : _a.textContent;
                    const jobLink = resultContent.querySelector("a.jcs-JobTitle").href;
                    const companyName = (_b = resultContent.querySelector(".companyName")) === null || _b === void 0 ? void 0 : _b.textContent;
                    const companyLocation = (_c = resultContent.querySelector(".companyLocation")) === null || _c === void 0 ? void 0 : _c.textContent;
                    const attributes = Array.from(resultContent.querySelectorAll(".attribute_snippet")).map((attribute) => {
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
            });
            for (let i = 0; i < results.length; i++) {
                counter = counter + 1;
                results[i].counter = counter;
                results[i].pageUrl = page.url();
            }
            console.log(results);
            jsonData = JSON.parse(fs_1.default.readFileSync(jsonFile, { encoding: "utf-8" }));
            const appendedData = [...jsonData, ...results];
            fs_1.default.writeFileSync(jsonFile, JSON.stringify(appendedData), {
                encoding: "utf-8",
            });
            yield page.$eval("a[data-testid='pagination-page-next']", (link) => {
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
    });
}
getVisual();
