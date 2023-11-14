const dayjs = require("dayjs");

function dateFormat(checkDate) {
  return dayjs(checkDate).format("DD MMM YYYY");
}

module.exports = dateFormat;
