class MailComponent {
  get randomMail() {
    return $('//span[@class="genytxt"]');
  }

  get inboxBtn() {
    return $$('button[class="md but text f24 egenbut"]')[2];
  }

  get cost() {
    //return $("table").$("tbody").$$("tr")[1].$("table").$("td")[4];
    return $$('h3')[1];
             
  }

  get inboxIframe(){
    return $('iframe#ifmail');
  }
}

module.exports = MailComponent;
