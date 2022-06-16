const chrome = require("selenium-webdriver/chrome");
const { Builder, locateWith, By } = require("selenium-webdriver");

let reqCount = 0;

const generateRandomInRange = (min, max) => {
  let difference = max - min;
  let rand = Math.random();
  rand = Math.floor(rand * difference);
  rand = rand + min;
  return rand;
};

const alphabet = ["a", "b", "c", "d"];
const validSentences = {};
const sentencesTried = {};

const sentenceGenerator = () => {
  const sentenceLength = generateRandomInRange(1, 30);
  const word = [];
  for (let i = 0; i < sentenceLength; i++) {
    word[i] = alphabet[generateRandomInRange(0, 4)];
  }

  const wordStr = word.join('');
  if (validSentences[wordStr] || sentencesTried[wordStr]) {
    return sentenceGenerator();
  }

  return wordStr;
};

const service = new chrome.ServiceBuilder("./chromedriver");
const driver = new Builder()
  .forBrowser("chrome")
  .setChromeService(service)
  .build();

driver.get("http://localhost:3000/");

const validSentenceFinder = async () => {
  const sentence = sentenceGenerator();
  const tokenInput = await driver.findElement(By.id("token-input"));
  const button = await driver.findElement(By.id("test-btn"));
  await driver.executeScript(
    "arguments[0].setAttribute('value', '" + sentence + "')",
    tokenInput
  );
  await driver.executeScript("arguments[0].click();", button);
  const pageText = await driver.getPageSource();
  const foundOk = pageText.indexOf("OK em ") !== -1;

  if (foundOk) {
    console.log(validSentences);
    validSentences[sentence] = true;
  }

  if (Object.values(validSentences).length < 10) {
    driver.navigate().refresh();
    ++reqCount;
    return await validSentenceFinder();
  }
  console.log(reqCount);
};


validSentenceFinder();
