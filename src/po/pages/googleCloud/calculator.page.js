import BasePage from './base.page.js'

class CalculatorPage extends BasePage {

//elements from Product component
get computeEngine() { return $('//span[text()="Compute Engine"]')}

//elements from Compute form component
get iFrameParent() {return $('iframe[src^="https://cloud.google.com/frame/products/calculator-legacy"]')}
get iFrameChild() {return $("#myFrame")}
get computeEngine() {return $('md-tab-item#tab-item-1')}
get numInstances() {return $('input[ng-model="listingCtrl.computeServer.quantity"]')}
get oSDropdown() {return $('md-select[ng-model="listingCtrl.computeServer.os"]')}
get provisioningModel() {return $('md-select[ng-model="listingCtrl.computeServer.class"]')}
get machineFamily() {return $('md-select[ng-model="listingCtrl.computeServer.family"]')}
get seriesDropdown() {return $("#select_value_label_95")}
get seriesN1Option() {return $("md-option#select_option_224")}
get machineType() {return $('md-select[ng-model="listingCtrl.computeServer.instance"]')}
get machineS8Option() {return $('//div[@class="md-select-menu-container md-active md-clickable"]//md-option[@value="CP-COMPUTEENGINE-VMIMAGE-N1-STANDARD-8"]')}
get gpuCheck() {return $('md-checkbox[ng-model="listingCtrl.computeServer.addGPUs"]')}
get gpuType() {return $('md-select[ng-model="listingCtrl.computeServer.gpuType"]')}
get gpuTypeT4Option() {return $('md-option[value="NVIDIA_TESLA_T4"]')}
get gpuNumber() {return $('md-select[ng-model="listingCtrl.computeServer.gpuCount"]')}
get gpuNumberOne() {return $('md-option[ng-repeat="item in listingCtrl.supportedGpuNumbers[listingCtrl.computeServer.gpuType]"][value="1"]')}
get localSSD() {return $('md-select[ng-model="listingCtrl.computeServer.ssd"]')}
get localSSDTwo() {return $("md-option#select_option_495")}
get datacenterLocation() {return $('md-select[ng-model="listingCtrl.soleTenant.location"]')}
get committedUsage() {return $('md-select[ng-model="listingCtrl.soleTenant.cud"]')}
get comittedOneYear() {return $('//div[@class="md-select-menu-container md-active md-clickable"]//md-option[@value="1"]')}
get addEstimateBtn() {return $('button[ng-click="listingCtrl.addComputeServer(ComputeEngineForm);"]')}

//elements from Estimation component
get totalCost() { return $('//div[@class="cpc-cart-total"]//b[@class="ng-binding"]')}
get emailBtn() {return $('button[id="Email Estimate"]')}

//elements from Email modal component
get emailField() {return $('input[ng-model="emailQuote.user.email"]')}
get sendEmailBtn() {return $('button[ng-click="emailQuote.emailQuote(true); emailQuote.$mdDialog.hide()"]')}

open() {
  return super.open("/calculator-legacy");
}

async selectDropElement(combobox, element){
  await combobox.click();
  await element.waitForClickable();
  await element.click();
}

}

export default new CalculatorPage();
