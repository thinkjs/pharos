const Base = require('./base');

module.exports = class extends Base {
    constructor(...args) {
        super(...args);
        this.modelInstance = this.model('site');
    }

    async getAction() {
        const { page, pagesize, keywords } = this.get();
        const isSuperAdmin = global.SUPER_ADMIN.is(this.userInfo.status);

        if (this.id) {
            this.id = parseInt(this.id);
        }
        let siteIds;

        if (!isSuperAdmin) {
          
            siteIds = await this.model('site_user').where({
                user_id: this.userInfo.id
            }).select();

            if (think.isEmpty(siteIds)) {
                siteIds = [null];
            } else {
                siteIds = siteIds.map(({ site_id }) => site_id);
            }

            if (this.id) {
                if (!site_id.includes(this.id)) {
                    return this.fail('SITE PERMISSION DENY');
                }
            }

            this.modelInstance = this.modelInstance.where({
                id: ['IN', siteIds]
            });
        }

        if (this.id) {
            const siteInfo = await this.modelInstance.where({ id: this.id }).find();
            return this.success(siteInfo);
        }

        let result;
        if (page) {
            if (keywords) {
                result = await this.model('site').where({
                    id: ['IN', siteIds],
                    _complex: {
                        name: ['like', `%${keywords}%`], 
                        url: ['like', `%${keywords}%`],
                        _logic: 'OR'
                    }
                }).page([page, pagesize]).countSelect();
            } else {
                result = await this.modelInstance.page([page, pagesize]).countSelect();
            }
        } else {
            if (keywords) {
                result = await this.model('site').where({
                    id: ['IN', siteIds],
                    _complex: {
                        name: ['like', `%${keywords}%`], 
                        url: ['like', `%${keywords}%`],
                        _logic: 'OR'
                    }
                }).select()
            } else {
                result = await this.modelInstance.select();
            }
        }
        return this.success(result);
    }

    async postAction() {
        const data = this.post();

        // data.user = [{ user_id: this.userInfo.id, status: 0 }];
        data.sid = think.uuid();
        // check site
        const site = await this.modelInstance.where({url: data.url}).find();
        if (!think.isEmpty(site)) {
            return this.fail('SITE_EXIST');
        }

        await this.modelInstance.addSite(data);
        const insertData = await this.modelInstance.where({sid: data.sid}).find();

        // 将默认监控项添加到metric表
        global.DefaultMetrics.forEach(item => {
            item.site_id = insertData.id;
            this.model('metric').add(item);
        });
        
        // 将该用户加入项目并设置为管理员
        await this.model('site_user').add({site_id: insertData.id, user_id: this.userInfo.id, status: 1});
        return this.success(insertData);
    }

    async putAction() {
        const { name, url } = this.post();
        await this.modelInstance.where({ id: this.id }).update({ name, url });
        return this.success();
    }

    async deleteAction() {
        try {
          const tables = ['options', 'site'];
          await Promise.all(
            tables.map(async table => this.model(table).where({ id: this.id }).delete())
          );
          return this.success();
        } catch (e) {
          if (think.isPrevent(e)) {
            return;
          }
    
          think.logger.error(e);
          this.fail('DELETE FAILED');
        }
    }
}
