import { typeEvent } from "./event";
const chromeMock = {
  runtime: {
    sendMessage(msg, _fn) {
      console.log(msg);
    },
  },
};

const chromeWapper =
  process.env.NODE_ENV === "production" ? chrome : chromeMock;

export const sendMessage = (result, callback) => {
  chromeWapper.runtime.sendMessage(
    { type: typeEvent.toContent, result: result },
    callback
  );
};

export default chromeWapper;
