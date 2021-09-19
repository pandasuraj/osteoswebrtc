const config = require('config');
class ValidatorBiz {
     constructor() {}

     validate(token) {
          return new Promise(async (resolve, reject) => {
               try {
                    if (token != config.get('token')) {
                         return reject('Token not valid!');
                    }
                    return resolve(token);
               } catch (error) {
                    return reject(error);
               }
          });
     }
}

module.exports = new ValidatorBiz();
