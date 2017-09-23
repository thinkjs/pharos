module.exports = {
  rules: {
    json(value, {argName, currentQuery}) {
      try {
        currentQuery[argName] = JSON.parse(value);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
};
