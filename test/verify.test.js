const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe("the span", () => {
  it("should use an inline style to be orange", async () => {
    const color = await page.$eval("span[style]", (span) => {
      const style = window.getComputedStyle(span);
      return style.color;
    });

    expect(color).toEqual("rgb(255, 165, 0)");
  });
});

describe('the <h1>', () => {
  it('should use an element selector to be grey', async () => {
    const color = await page.$eval("h1", (heading) => {
      const style = window.getComputedStyle(heading);
      return style.color;
    });
    
    expect(color).toEqual('rgb(128, 128, 128)');
  });
});

describe('the div with "brown-text" class', () => {
  it('should use a class selector to be brown', async () => {
    const color = await page.$eval('div[class="brown-text"]', (div) => {
      const style = window.getComputedStyle(div);
      return style.color;
    });
      
    expect(color).toEqual('rgb(165, 42, 42)');
  });
});

describe('the div with "selector-id" id', () => {
  it('should use an id selector to be pink', async () => {
    const color = await page.$eval('div[id="selector-id"]', (div) => {
      const style = window.getComputedStyle(div);
      return style.color;
    });
    
    expect(color).toEqual('rgb(255, 192, 203)');
  });
});
