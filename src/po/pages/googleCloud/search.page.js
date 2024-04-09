const BasePage = require("./base.page.js");
const {SearchComponent} = require("../../components");

class SearchPage extends BasePage {
  constructor() {
    super("https://cloud.google.com/search");
    this.searchComponent = new SearchComponent();
  }
}

module.exports = SearchPage;
