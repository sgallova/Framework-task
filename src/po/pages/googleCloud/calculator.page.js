const BasePage = require("./base.page.js");

const {
  ProductComponent,
  ComputeFormComponent,
  EstimationComponent,
  EmailModalComponent,
} = require("../../components");

class CalculatorPage extends BasePage {
  constructor() {
    super("https://cloud.google.com/products/calculator-legacy");
    this.productComponent = new ProductComponent();
    this.computeFormComponent = new ComputeFormComponent();
    this.estimationComponent = new EstimationComponent();
    this.emailModalComponent = new EmailModalComponent();
  }
}

module.exports = CalculatorPage;
