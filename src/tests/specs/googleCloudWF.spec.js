const devTestData = require('../data/devTestData.json');
const HomePage = require("../../po/pages/googleCloud/home.page.js");
const SearchPage = require("../../po/pages/googleCloud/search.page.js");
const CalculatorPage = require("../../po/pages/googleCloud/calculator.page.js");
const MailPage = require("../../po/pages/mailGenerator/mail.page.js");

const homePage = new HomePage();
const searchPage = new SearchPage();
const calculatorPage = new CalculatorPage();
const mailPage = new MailPage("https://yopmail.com/email-generator", "yopmail");

describe("Testsuite for checking the workflow of tasks 3 & 4", () => {
 
  const expectedText = `Total Estimated Cost: USD ${devTestData.productData.amount} per 1 month`;

  it("should search for a legacy calculator on the Google cloud page", async () => {
    await homePage.open();
    await homePage.header.searchIcon.click();
    await homePage.header.searchBar.setValue(
      devTestData.productData.searchText
    );
    await homePage.hitEnter();

    // wait for  the browser to be redirected to Search results and the page to be fully loaded
    await browser.waitUntil(async () => {
      (await browser.getUrl()) !== homePage.url;
      return await browser.execute(() => document.readyState === "complete");
    });

    //Assertion--> verify that the item Calculator legacy is listed in the search result
    await expect(
      await searchPage.searchComponent.item("calculator_legacy")
    ).toBeDisplayed();
  });

  it("should use the calculator to request an estimation for compute engine", async () => {
    // Go to the calculator page (legacy)
    await searchPage.searchComponent
      .item("calculator_legacy")
      .waitForClickable({ timeout: 5000 });
    await searchPage.searchComponent.item("calculator_legacy").click();

    // wait for  the browser to be redirected to Calculator and the page to be fully loaded
    await browser.waitUntil(async () => {
      (await browser.getUrl()) !== searchPage.url;
      return await browser.execute(() => document.readyState === "complete");
    });

    await browser.maximizeWindow();

    //Accesing to iFrames that contain the form
    await browser.switchToFrame(
      await calculatorPage.computeFormComponent.iFrameParent
    );
    await browser.switchToFrame(
      await calculatorPage.computeFormComponent.iFrameChild
    );

    // Fillout the form
    await calculatorPage.computeFormComponent.numInstances.setValue("4");
    await calculatorPage.computeFormComponent.seriesDropdown.click();

    await calculatorPage.computeFormComponent.seriesN1Option.waitForClickable({
      timeout: 5000,
    });
    await calculatorPage.computeFormComponent.seriesN1Option.click();

    await calculatorPage.computeFormComponent.machineType.click();
    await calculatorPage.computeFormComponent.machineS8Option.waitForClickable({
      timeout: 5000,
    });
    await calculatorPage.computeFormComponent.machineS8Option.click();

    await calculatorPage.computeFormComponent.gpuCheck.click();

    await calculatorPage.computeFormComponent.gpuType.click();
    await calculatorPage.computeFormComponent.gpuTypeT4Option.waitForClickable({
      timeout: 5000,
    });
    await calculatorPage.computeFormComponent.gpuTypeT4Option.click();

    await calculatorPage.computeFormComponent.gpuNumber.click();
    await calculatorPage.computeFormComponent.gpuNumberOne.waitForClickable({
      timeout: 5000,
    });
    await calculatorPage.computeFormComponent.gpuNumberOne.click();

    await calculatorPage.computeFormComponent.localSSD.click();
    await calculatorPage.computeFormComponent.localSSDTwo.waitForClickable({
      timeout: 5000,
    });
    await calculatorPage.computeFormComponent.localSSDTwo.click();

    await calculatorPage.computeFormComponent.committedUsage.click();
    await calculatorPage.computeFormComponent.comittedOneYear.waitForClickable({
      timeout: 5000,
    });
    await calculatorPage.computeFormComponent.comittedOneYear.click();

    await calculatorPage.computeFormComponent.addEstimateBtn.waitForClickable({
      timeout: 5000,
    });
    await browser.execute(function (btn) {
      btn.click();
    }, await calculatorPage.computeFormComponent.addEstimateBtn);

    //Assertion--> After sending the estimation, the form is cleaned up
    expect(await calculatorPage.computeFormComponent.numInstances).toHaveValue(
      ""
    );

    //Check the price is calculated in the right section of the calculator. There is a line “Total Estimated Cost: USD ${amount} per 1 month”
    expect(
      await calculatorPage.estimationComponent.totalCost.getText()
    ).toEqual(expectedText);
  });

  it("should send the estimation by email", async () => {
    const estimationUrl = await browser.getUrl();

    //open new tab to generate a random email
    await browser.newWindow(mailPage.url);
    await browser.switchWindow(mailPage.match);
    //save random email
    const randomEmail = await mailPage.mailComponent.randomMail.getText();

    //Go back to the Google cloud page
    await browser.switchWindow(estimationUrl);
    await browser.switchToFrame(
      await calculatorPage.computeFormComponent.iFrameParent
    );
    await browser.switchToFrame(
      await calculatorPage.computeFormComponent.iFrameChild
    );
    //Select 'EMAIL ESTIMATE'
    await browser.execute(function (Emailbtn) {
      Emailbtn.click();
    }, await calculatorPage.estimationComponent.emailBtn);

    //Enter random email
    await calculatorPage.emailModalComponent.emailField.setValue(
      randomEmail + "@yopmail.com"
    );
    await calculatorPage.emailModalComponent.sendEmailBtn.click();

    await browser.pause(2000);

    //Go back to the random generator email page and check the inbox
    await browser.switchWindow(mailPage.match);

    await browser.pause(2000);

    if(await browser.getUrl()==="https://yopmail.com/es/email-generator#google_vignette"){
      throw new Error("There's an Ad On blocking the test execution. Re launch the test")
    }else{
      await mailPage.mailComponent.inboxBtn.waitForClickable({
        timeout: 5000,
      });
  
      await mailPage.mailComponent.inboxBtn.click();

      await browser.switchToFrame(
        await mailPage.mailComponent.inboxIframe
      );

      //check that the emailed 'Total Estimated Monthly Cost' matches the result in the calculator.
   expect(await mailPage.mailComponent.cost.getText()).toEqual(
        "USD " +devTestData.productData.amount
      );
    
    }  
  });
});
