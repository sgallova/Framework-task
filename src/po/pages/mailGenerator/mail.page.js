class MailPage {
  
  get randomMail() {return $('//span[@class="genytxt"]')}
  get inboxBtn() {return $$('button[class="md but text f24 egenbut"]')[2]}
  get cost() {return $$('h3')[1]}
  get inboxIframe(){return $('iframe#ifmail')}

  open() {
   return browser.url(this.url);
  }
}

export default new MailPage();
