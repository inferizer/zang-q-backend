const dayjs = require("dayjs");

function dateFormat(checkDate) {
  return dayjs(checkDate).format("DD MMMM YYYY");
}

module.exports = dateFormat;
