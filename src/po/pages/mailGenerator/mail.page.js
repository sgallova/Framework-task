const {MailComponent} = require("../../components");

class MailPage {
  constructor(url, match) {
    this.url = url;
    this.match = match;
    this.mailComponent = new MailComponent();
  }

  open() {
    browser.url(this.url);
  }
}

module.exports = MailPage;
