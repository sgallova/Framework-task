const {HeaderComponent} = require("../../components");

class BasePage {
  constructor(url) {
    this.url = url;
    this.header = new HeaderComponent();
  }

  open() {
    browser.url(this.url);
  }

  hitEnter() {
    browser.keys("\uE007");
  }
}

module.exports = BasePage;
