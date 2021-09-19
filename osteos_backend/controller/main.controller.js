const meetsBiz = require('../biz/meets.biz');
const validatorBiz = require('../biz/validator');
const jsonwebtoken = require('jsonwebtoken');
const { privateKey } = require('../constant/app.constants');
const config = require('config');

module.exports = {
     register(app) {
          app.route('/create/room').post(async (request, response, next) => {
               try {
                    const { created_by } = request.body;

                    const { token } = request.headers;

                    await validatorBiz.validate(token);

                    const result = await meetsBiz.createRoom(created_by);

                    response.json({
                         success: true,
                         message: 'done',
                         data: result,
                    });
               } catch (error) {
                    response.json({
                         success: false,
                         message: error,
                    });
               }
          });

          app.route('/roomInfo').post(async (request, response, next) => {
               try {
                    const { token } = request.headers;
                    await validatorBiz.validate(token);

                    const { user_name, password } = request.body;

                    const resp = await meetsBiz.getRoomInfo(
                         user_name,
                         password
                    );
                    response.json({
                         success: true,
                         message: 'Fetched room info',
                         data: resp,
                    });
               } catch (error) {
                    response.json({
                         success: false,
                         message: error.message,
                    });
               }
          });
          
          app.route('/generate_jwt').post(async (req, res) => {
               const { email, roomid } = req.body;
               let token = jsonwebtoken.sign(
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
                         sub: config.get('jitsi.key'),
                         // exp: Math.round(
                         //      now.setHours(now.getHours() + 1) / 1000
                         // ),
                         // nbf: Math.round(new Date().getTime() / 1000) - 10,
                    },
                    privateKey,
                    {
                         algorithm: 'RS256',
                         header: { kid: config.get('jitsi.kid') },
                    }
               );
               return res.status(200).json({
                    token: [token, roomid],
               });
          });
     },
};
