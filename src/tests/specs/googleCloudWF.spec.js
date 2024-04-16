import devTestData from '../data/devTestData.json' with { type: "json" };
import HomePage from "../../po/pages/googleCloud/home.page.js";
import SearchPage from "../../po/pages/googleCloud/search.page.js";
import CalculatorPage from "../../po/pages/googleCloud/calculator.page.js";
import MailPage from "../../po/pages/mailGenerator/mail.page.js";

describe("Testsuite for checking the workflow of tasks 3 & 4", () => {
 
  const expectedText = `Total Estimated Cost: USD ${devTestData.productData.amount} per 1 month`;

  it("should search for a legacy calculator on the Google cloud page", async () => {
    await HomePage.open();
    await HomePage.searchIcon.click();
    await HomePage.searchBar.setValue(
      devTestData.productData.searchText
    );
    await HomePage.hitEnter();

    // wait for  the browser to be redirected to Search results and the page to be fully loaded
    await browser.waitUntil(async () => {
      (await browser.getUrl()) !== browser.options.baseUrl + HomePage.path;
      return await browser.execute(() => document.readyState === "complete");
    });

    //Assertion--> verify that the item Calculator legacy is listed in the search result
    await expect(
      await SearchPage.item("calculator_legacy")
    ).toBeDisplayed()
  });

  it("should use the calculator to request an estimation for compute engine", async () => {
    // Having the search results, click on the item calculator legacy
    await SearchPage.item("calculator_legacy").waitForClickable();
    await SearchPage.item("calculator_legacy").click();

    await browser.maximizeWindow();

    //Accesing to iFrames that contain the form
    await browser.switchToFrame(
      await CalculatorPage.iFrameParent
    );
    await browser.switchToFrame(
      await CalculatorPage.iFrameChild
    );

    // Fillout the form
    await CalculatorPage.numInstances.setValue("4");
    await CalculatorPage.selectDropElement(CalculatorPage.seriesDropdown, CalculatorPage.seriesN1Option);
    await CalculatorPage.selectDropElement(CalculatorPage.machineType, CalculatorPage.machineS8Option);
    await CalculatorPage.gpuCheck.click();
    await CalculatorPage.selectDropElement(CalculatorPage.gpuType, CalculatorPage.gpuTypeT4Option);
    await CalculatorPage.selectDropElement(CalculatorPage.gpuNumber, CalculatorPage.gpuNumberOne);
    await CalculatorPage.selectDropElement(CalculatorPage.localSSD, CalculatorPage.localSSDTwo);
    await CalculatorPage.selectDropElement(CalculatorPage.committedUsage, CalculatorPage.comittedOneYear);

    //submit form
    await CalculatorPage.addEstimateBtn.waitForClickable();
    await browser.execute(function (btn) {
      btn.click();
    }, await CalculatorPage.addEstimateBtn);

    //Assertion--> After sending the estimation, the form is cleaned up
    expect(await CalculatorPage.numInstances).toHaveValue("");

    //Assertion--> Check the price is calculated in the right section of the calculator. There is a line “Total Estimated Cost: USD ${amount} per 1 month”
    expect(await CalculatorPage.totalCost.getText()).toEqual(expectedText);

  });

  it("should send the estimation by email", async () => {
    const estimationUrl = await browser.getUrl();

    //open new tab to generate a random email
    await browser.newWindow(devTestData.randomEmail.url);
    await browser.switchWindow(devTestData.randomEmail.match);

    //save random email
    const randomEmail = await MailPage.randomMail.getText();

    //Go back to the Google cloud page
    await browser.switchWindow(estimationUrl);
    await browser.switchToFrame(
      await CalculatorPage.iFrameParent
    );
    await browser.switchToFrame(
      await CalculatorPage.iFrameChild
    );
    //click on button 'EMAIL ESTIMATE'
    await browser.execute(function (Emailbtn) {
      Emailbtn.click();
    }, await CalculatorPage.emailBtn);

    //Enter random email and send it
    await CalculatorPage.emailField.setValue(randomEmail +"@"+ devTestData.randomEmail.domain);
    await CalculatorPage.sendEmailBtn.click();

    //Go back to the random generator email page and check the inbox
    await browser.switchWindow(devTestData.randomEmail.match);
    await browser.pause(2000);

    // Stop the test if an Ad on is displayed
    if(await browser.getUrl() === devTestData.randomEmail.ads){
      throw new Error("There's an Ad On blocking the test execution. Re launch the test")
    }else{
      await MailPage.inboxBtn.waitForClickable();
      await MailPage.inboxBtn.click();

      await browser.switchToFrame(
      await MailPage.inboxIframe
      );

    //Assertion-->check that the emailed 'Total Estimated Monthly Cost' matches the result in the calculator.
    expect(await MailPage.cost.getText()).toEqual(
        "USD " +devTestData.productData.amount
      );
    
    }  
  });
});
