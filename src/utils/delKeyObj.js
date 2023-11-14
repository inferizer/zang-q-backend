function delKeyObj(obj, delKey) {
  delKey.forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      delete obj[key];
    }
  });
}

module.exports = delKeyObj;
