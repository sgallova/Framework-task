class BasePage {
  
  //define common elements
  get searchIcon() { return $('[jsname="Ohx1pb"]')}
  get searchBar() {return $('input[placeholder="Search"]')}

  open(path) {
    return browser.url(path);
  }

  hitEnter() {
    return browser.keys("\uE007");
  }
}

export default BasePage;
