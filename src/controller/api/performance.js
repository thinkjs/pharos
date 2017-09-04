const path = require('path');
const crypto = require('crypto');
const detector = require('detector');
const BaseRest = require('../rest');
const IPService = require('../../service/ip');
const ipServiceInstance = new IPService(path.join(
  think.ROOT_PATH, 'www/ip.dat'
));

module.exports = class extends BaseRest {
  /** 获取访问用户 id */
  get visitUser() {
    let visitUser = this.cookie('_pharos_id');
    if (visitUser) {
      return visitUser;
    }

    visitUser = crypto.randomBytes(8).toString('hex');
    this.cookie('_pharos_id', visitUser);
    return visitUser;
  }

  /** 根据 UA 获取信息 */
  get userUA() {
    const ua = detector.parse(this.userAgent);

    return {
      browser_engine: ua.engine.name,
      browser_name: ua.browser.name,
      browser_version: ua.broswer.version,
      device_brand: ua.device.name,
      // device_model: ua.device,
      // device_type:,
      device_pixel: this.get('screen'),
      os: ua.os.name,
      os_version: ua.os.version
    };
  }

  /** 根据 IP 获取位置信息 */
  get userIP() {
    const [
      location_country,
      location_province,
      location_city,
      location_isp
    ] = ipServiceInstance.find(this.ip);
    return {
      location_ip: this.ip,
      location_country,
      location_province,
      location_city,
      location_isp
    };
  }

  async getAction() {
    const visitUser = this.visitUser;
    const ua = this.userUA;
    const ip = this.userIP;

    const user = {
      idvisitor: visitUser,
      last_action_time: think.datetime(),
      ...ua,
      ...ip
    };

    user.visit_url = {};
    user.performance = {};

    const userInfo = await this.modelInstance.where({
      idvisitor: visitUser
    }).find();

    if (!think.isEmpty(userInfo)) {
      user.first_action_time = user.last_action_time;
      await this.modelInstance.add(user);
    } else {
      await this.modelInstance.where({id: userInfo.id}).update(user);
    }

    return this.success();
  }
};
