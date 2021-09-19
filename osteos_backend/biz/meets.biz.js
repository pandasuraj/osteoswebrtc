const roomRepo = require('../repositories/room.repo');
const moment = require('moment');
const uuid = require('uuid').v4;
const config = require('config');

const jwtBiz = require('./jwt.biz');

class MeetsBiz {
     constructor() {}

     createRoom(created_by) {
          return new Promise(async (resolve, reject) => {
               try {
                    const start = moment(
                         moment().subtract(5, 'minutes')
                    ).format('YYYY-MM-DD HH:mm:ss');
                    const end = moment(
                         moment().add(35, 'minutes').toDate()
                    ).format('YYYY-MM-DD HH:mm:ss');
                    const user_name = uuid();
                    const password = Math.random().toString(36).slice(-8);
                    const room_name = `Room${Math.random()
                         .toString(36)
                         .slice(-4)}`;
                    await roomRepo.insertRoom(
                         created_by,
                         start,
                         end,
                         user_name,
                         password,
                         room_name
                    );
                    return resolve({
                         user_name,
                         password,
                         room_name,
                    });
               } catch (error) {
                    return reject(error);
               }
          });
     }

     getRoomInfo(user_name, password) {
          return new Promise(async (resolve, reject) => {
               try {
                    const { room_name, start_time, end_time } =
                         await roomRepo.getRoomInfoByUser(user_name, password);
                    const room_url = `${config.get('jitsi.key')}/${room_name}`;
                    const now = new Date(
                         moment(start_time)
                              .add(6, 'hours')
                              .subtract(30, 'minutes')
                    ).getTime();

                    console.log('now', now);
                    const end = new Date(
                         moment(end_time)
                              .add(6, 'hours')
                              .subtract(30, 'minutes')
                    ).getTime();

                    //console.log('now1', now);
                    const token = jwtBiz.generate(
                         require('../constant/app.constants').privateKey,
                         {
                              email: user_name,
                              appId: config.get('jitsi.key'),
                              kid: config.get('jitsi.kid'),
                              startTime: now,
                              endTime: end,
                         }
                    );

                    if (now < end) {
                         return resolve({
                              room_url,
                              token,
                         });
                    }
                    throw new Error(
                         'Username and password expired at ' + end_time
                    );
               } catch (error) {
                    return reject(error);
               }
          });
     }
}

module.exports = new MeetsBiz();
