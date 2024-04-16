import BasePage from './base.page.js'

class HomePage extends BasePage {

  open() {
    return super.open("/?hl=en");
  }
}

export default new HomePage();