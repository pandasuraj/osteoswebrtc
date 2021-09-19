const mysql = require('./../db/mysql');
class RoomRepo {
     insertRoom(
          created_by,
          start_time,
          end_time,
          user_name,
          password,
          room_name
     ) {
          return new Promise(async (resolve, reject) => {
               try {
                    const query = `INSERT INTO room(created_by, start_time, end_time, user_name, password, room_name) values (?, ?, ?, ?, ?, ?)`;
                    const result = await mysql.execute(query, [
                         created_by,
                         start_time,
                         end_time,
                         user_name,
                         password,
                         room_name,
                    ]);
                    return resolve(result);
               } catch (error) {
                    return reject(error);
               }
          });
     }

     getRoomInfoByUser(user_name, password) {
          return new Promise(async (resolve, reject) => {
               try {
                    const query = `SELECT room_name, start_time, end_time 
                   from room where user_name = ? and password = ?`;
                    const result = await mysql.execute(query, [
                         user_name,
                         password,
                    ]);
                    if (result && result.length) {
                         return resolve(result[0]);
                    }
                    throw new Error('Room not found');
               } catch (error) {
                    return reject(error);
               }
          });
     }
}

module.exports = new RoomRepo();
