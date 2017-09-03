module.exports = {
  rules: {
    json(value, {currentQuery, validName}) {
      try {
        currentQuery[validName] = JSON.parse(value);
      } catch (e) {
        return false;
      }
    }
  }
};
