let Puppeteer= require("puppeteer");
let fs=require("fs");
let credentialsFile=process.argv[2];
let url;

(async function(){try{
//credentials
let data= await fs.promises.readFile(credentialsFile,"utf-8");
let credentials=JSON.parse(data);
url=credentials.url;

//Start browser
let browser=await Puppeteer.launch({
headless:false,
defaultViewPort: null,
//args: ["--start-maximized","--disable-notifcations"]// open window in maximum mode
});

//new tab open
let numberOfPages=await browser.pages();
let tab= numberOfPages[0];
//goto home page 
await tab.goto(url);

let loanSliderCircle = await tab.waitForSelector("#loanamountslider >span");
//await page.waitFor(3000)
let interestSliderCircle = await tab.waitForSelector("#loaninterestslider >span");
//await page.waitFor(40000)
let tenureSliderCircle = await tab.waitForSelector("#loantermslider >span");
//await page.waitFor(40000)

let bounding_box1 = await loanSliderCircle.boundingBox();
let bounding_box2 = await interestSliderCircle.boundingBox();
let bounding_box3 = await tenureSliderCircle.boundingBox();

await tab.mouse.move(bounding_box1.x + bounding_box1.width / 2, bounding_box1.y + bounding_box1.height / 2);
await tab.mouse.move(83, 0 );
await tab.waitFor(2000)

await tab.mouse.move(bounding_box2.x + bounding_box2.width / 2, bounding_box2.y + bounding_box2.height / 2);
await tab.mouse.move(88, 0 );
await tab.waitFor(2000)

await tab.mouse.move(bounding_box3.x + bounding_box3.width / 2, bounding_box3.y + bounding_box3.height / 2);
await tab.mouse.move(-111, 0 );

//let loanEMIElement = await tab.waitForSelector("#emiamount >p>span");
//let loanEMItext = loanEMIElement.get
//await tab.$eval('#emiamount >p>span', e => e.innerText);
let linkTexts = await tab.$$eval("#emiamount >p>span",elements=> elements.map(item=>item.textContent))
let linkTexts1 = await tab.$$eval("#emitotalinterest >p>span",elements=> elements.map(item=>item.textContent))
let linkTexts2 = await tab.$$eval("#emitotalamount >p>span",elements=> elements.map(item=>item.textContent))

console.log("`````````````````````````````````````````````````````````````````````````````````````````````")
await console.log(`The Loan EMI amount : ${linkTexts} `)
await console.log(`The Total interest Payable : ${linkTexts1} `)
await console.log(`The Total Paymet [interest + principal] : ${linkTexts2} `)

console.log("`````````````````````````````````````````````````````````````````````````````````````````````")
//await tab.getText('#emiamount >p>span')[0]

//await tab.waitFor(2000)
}
catch (err) {
    console.log(err);
}
})();