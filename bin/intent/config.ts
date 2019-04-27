
import defaults from './config/defaults';

const PRODUCTION = "production";
const DEVELOPMENT = "development";

export default (env) => {
  let config;

  switch ((env || PRODUCTION).toLowerCase()) {
    case PRODUCTION:
      config = require("./config/production").default;
      break;

    case DEVELOPMENT:
      config = require("./config/development").default;
      break;

    default:
      throw new Error("Unknown environment \"${env}\"");
  }

  return Object.assign(
    {},
    defaults,
    config
  );
};
