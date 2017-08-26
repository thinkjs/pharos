module.exports = [
  [/\/api\/user(?:\/(\d+))?/, 'api/user?id=:1', 'rest'],
  [/\/api\/token(?:\/(\d+))?/, 'api/token?id=:1', 'rest']
];
