const path = require('path');
const cors = require('kcors');
const routerREST = require('think-router-rest');

const isDev = think.env === 'development';

module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|doc|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev,
      contentType(ctx) {
        // All request url starts of /api or request header contains `X-Requested-With: XMLHttpRequest` will output json error
        if (!isDev) {
          return 'json';
        }

        const APIRequest = /^\/api/.test(ctx.request.path);
        const AJAXRequest = ctx.is('X-Requested-With', 'XMLHttpRequest');

        return APIRequest || AJAXRequest ? 'json' : 'html';
      }
    }
  },
  {
    handle: cors,
    options: {
      origin: (ctx) => {
        return ctx.header.origin;
      },
      credentials: true,
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    }
  },
  'payload',
  'router',
  {
    handle: routerREST
  },
  'logic',
  {
    handle: 'controller',
    options: {
      emptyController: 'index'
    }
  }
];
