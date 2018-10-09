import sql from "mssql";
import promClient from "../utils/prometheus";

class PRequest extends sql.Request {
  constructor(...args) {
    super(...args);
  }

  execute() {
    return new Promise((resolve, reject) => {
      let startTime = new Date();
      super
        .execute(...arguments)
        .then(s => {
          promClient.endDbRequestTimer(arguments[0], startTime);
          resolve(s);
        })
        .catch(c => reject(c));
    });
  }
}

export default {
  ...sql,
  Request: PRequest
};
