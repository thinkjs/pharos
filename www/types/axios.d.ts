export = index;
declare function index(...args: any[]): any;
declare namespace index {
  class Axios {
    constructor(instanceConfig: any);
    defaults: any;
    interceptors: any;
    get(url: any, config: any): any;
    head(url: any, config: any): any;
    options(url: any, config: any): any;
    patch(url: any, data: any, config: any): any;
    post(url: any, data: any, config: any): any;
    put(url: any, data: any, config: any): any;
    request(config: any, ...args: any[]): any;
  }
  class Cancel {
    constructor(message: any);
    message: any;
  }
  class CancelToken {
    static source(): any;
    constructor(executor: any);
    promise: any;
    throwIfRequested(): void;
  }
  function all(promises: any): any;
  function create(instanceConfig: any): any;
  namespace defaults {
    function adapter(config: any): any;
    const headers: {
      common: {
        Accept: string;
      };
      delete: {};
      get: {};
      head: {};
      patch: {
        "Content-Type": string;
      };
      post: {
        "Content-Type": string;
      };
      put: {
        "Content-Type": string;
      };
    };
    const maxContentLength: number;
    const timeout: number;
    const transformRequest: Function[];
    const transformResponse: Function[];
    function validateStatus(status: any): any;
    const xsrfCookieName: string;
    const xsrfHeaderName: string;
  }
  function get(...args: any[]): any;
  function head(...args: any[]): any;
  const interceptors: {
    request: {
      eject: Function;
      forEach: Function;
      handlers: any[];
      use: Function;
    };
    response: {
      eject: Function;
      forEach: Function;
      handlers: any[];
      use: Function;
    };
  };
  function isCancel(value: any): any;
  function options(...args: any[]): any;
  function patch(...args: any[]): any;
  function post(...args: any[]): any;
  function put(...args: any[]): any;
  function request(...args: any[]): any;
  function spread(callback: any): any;
}
