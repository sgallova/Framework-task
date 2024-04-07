const prodTestData = require('../tests/data/prodTestData.json');

exports.config = {
   
    baseUrl: 'https://prod.example.com',
    
    before: function (capabilities, specs) {
        global.testData = prodTestData;
    }
};