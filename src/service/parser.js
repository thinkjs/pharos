/**
 * https://github.com/chriso/nginx-parser/pulls
 */
const fs = require('fs');
const url = require('url');
const path = require('path');
const qs = require('querystring');
const readline = require('readline');
const { spawn } = require('child_process');

module.exports = class {
  /**
   * Create a log parser.
   *
   * @param {String} format
   */
  constructor(format) {
    this.directives = {};

    const prefix = format.match(/^[^$]*/);
    if (prefix) {
      format = this.escape(prefix[0]) + format.slice(prefix[0].length);
    }

    this.parser = format;

    const directive = /\$([a-z_]+)(.)?([^$]+)?/g;
    let match; let regex; let boundary; let i = 1;

    while ((match = directive.exec(format))) {
      this.directives[match[1]] = i++;
      if (match[2]) {
        boundary = this.escape(match[2]);
        regex = '([^' + boundary + ']*?)' + boundary;
        if (match[3]) {
          regex += this.escape(match[3]);
        }
      } else {
        regex = '(.+)$';
      }
      this.parser = this.parser.replace(match[0], regex);
    }

    this.parser = new RegExp(this.parser);
  }

  /**
   * Parse a log file.
   *
   * @param {String} path
   * @param {Object} options (optional)
   * @param {Function} iterator - called for each line
   * @param {Function} callback (optional) - called at the end
   */
  read(path, options, iterator, callback) {
    if (typeof options === 'function') {
      callback = iterator;
      iterator = options;
    }
    if (!path || path === '-') {
      return this.stdin(iterator, callback);
    } else if (options.tail) {
      return this.tail(path, iterator, callback);
    }
    return this.stream(fs.createReadStream(path), iterator, callback);
  }

  /**
   * Parse a log file and watch it for changes.
   *
   * @param {String} path
   * @param {Function} iterator - called for each line
   * @param {Function} callback (optional) - called at the end
   */
  tail(path, iterator, callback) {
    var stream = spawn('tail', ['-F', '-c', '+0', path]).stdout;
    return this.stream(stream, iterator, callback);
  }

  /**
   * Parse a log stream from STDIN.
   *
   * @param {Function} iterator - called for each line
   * @param {Function} callback (optional) - called at the end
   */
  stdin(iterator, callback) {
    return this.stream(process.stdin, iterator, callback);
  };

  /**
   * Parse a log stream.
   *
   * @param {ReadableStream} stream
   * @param {Function} iterator - called for each line
   * @param {Function} callback (optional) - called at the end
   */
  async stream(stream, iterator, callback) {
    const rl = readline.createInterface({ input: stream });
    try {
      // eslint-disable-next-line
      for await (const row of rl) {
        this.parseLine(row, iterator);
      }
    } catch (e) {
      if (callback) callback(e);
    }
  };

  /**
   * Parse a log line.
   *
   * @param {Buffer|String} line
   * @param {Function} iterator
   */
  parseLine(line, iterator) {
    const match = line.toString().match(this.parser);
    if (!match) {
      return;
    }

    const row = {
      msec: null,
      time_iso8601: null,
      remote_addr: null,
      query_string: null,
      http_x_forwarded_for: null,
      http_user_agent: null,
      http_referer: null,
      time_local: null,
      pipe: null,
      connection: null,
      bytes_sent: null,
      body_bytes_sent: null,

      request: null,
      status: null,
      request_time: null,
      request_length: null,
      pathname: null,
      querystring: null,

      date: null,
      timestamp: null,
      ip: null,
      ip_str: null
    };

    for (const key in this.directives) {
      row[key] = match[this.directives[key]];
      if (row[key] === '-') {
        row[key] = null;
      }
    }

    // Parse the request url
    if (row.request) {
      const req = row.request.split(' ');
      if (req[0]) {
        row.method = req[0];
      }
      if (req[1]) {
        row.url = req[1];
        const urlInfo = url.parse(req[1]);
        row.pathname = urlInfo.pathname;
        if (urlInfo.search) {
          row.querystring = qs.parse(urlInfo.search.slice(1));
        }
      }

      if (req[2]) {
        row.http_version = req[2];
      }
    }

    // Parse the timestamp
    if (row.time_iso8601) {
      row.date = new Date(row.time_iso8601);
    } else if (row.msec) {
      row.date = new Date(Number(row.msec.replace('.', '')));
    }
    if (row.date) {
      row.timestamp = row.date.getTime();
    }

    // Parse the user's IP
    if (row.http_x_forwarded_for) {
      row.ip_str = row.http_x_forwarded_for;
    } else if (row.remote_addr) {
      row.ip_str = row.remote_addr;
    }
    if (row.ip_str) {
      var ip = row.ip_str.split('.', 4);
      row.ip = Number(ip[0]) * (2 << 23) +
        Number(ip[1]) * (2 << 15) +
        Number(ip[2]) * (2 << 7) +
        Number(ip[3]);
    }

    iterator(row);
  }

  /**
   * Escape regular expression tokens.
   *
   * @param {String} str
   * @return {String}
   */
  escape(str) {
    return str.replace(new RegExp('[.*+?|()\\[\\]{}]', 'g'), '\\$&');
  }
};
