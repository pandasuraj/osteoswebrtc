const jsonwebtoken = require('jsonwebtoken');
module.exports = {
     generate: (privateKey, { email, appId, kid, startTime, endTime }) => {
          //console.log(startTime,endTime,"here ")
          try {
               console.log('here', startTime);
               const now = new Date();
               const jwt = jsonwebtoken.sign(
                    {
                         aud: 'jitsi',
                         context: {
                              user: {
                                   email: email,
                                   moderator: 'true',
                              },
                              features: {
                                   livestreaming: true,
                                   'outbound-call': true,
                                   'sip-outbound-call': false,
                                   transcription: true,
                                   recording: true,
                              },
                         },
                         iss: 'chat',
                         room: '*',
                         sub: appId,
                         exp: Math.round(
                              now.setHours(now.getHours() + 1) / 1000
                         ),
                         nbf: Math.round(new Date().getTime() / 1000) - 10,
                    },
                    privateKey,
                    { algorithm: 'RS256', header: { kid } }
               );

               return jwt;
          } catch (error) {
               throw error;
          }
     },
};
