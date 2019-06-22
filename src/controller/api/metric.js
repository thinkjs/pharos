const Base = require('./base');

module.exports = class extends Base {
    constructor(...args) {
        super(...args);
        this.modelInstance = this.model('metric');
    }

    async getAction() {

        if (!this.id) {
            return this.fail('SITE ID MISS');
        }

        const { type } = this.get();

        const sites = await this.model('site').where({id: this.id}).select();
        if (think.isEmpty(sites)) {
            return this.fail('SITE NOT FOUND');
        }

        const { page = 1, pagesize = 50, keywords } = this.get();

        let result;

        if (keywords) {
            result = await this.modelInstance.where({
                site_id: this.id, 
                type,
                display_name: ['like', `%${keywords}%`]
            }).page([page, pagesize]).countSelect();
        } else {
            result = await this.modelInstance.where({site_id: this.id, type}).page([page, pagesize]).countSelect();
        }

        return this.success(result);
    }

    async postAction() {
        if (!this.id) {
            return this.fail('SITE ID MISS');
        }

        const sites = await this.model('site').where({id: this.id}).select();
        if (think.isEmpty(sites)) {
            return this.fail('SITE NOT FOUND');
        }
        const data = this.post();
        data.site_id = this.id;

        if (!this.checkMetricAuth()) {
            return this.fail('PERMISSION_DENIED');
        }

        const result = await this.modelInstance.addMetric(data);
        this.success(result);

    }

    async putAction() {
        if (!this.id) {
            return this.fail('SITE ID MISS');
        }

        const sites = await this.model('site').where({id: this.id}).select();
        if (think.isEmpty(sites)) {
            return this.fail('SITE NOT FOUND');
        }

        const data = this.post();

        if (!this.checkMetricAuth()) {
            return this.fail('PERMISSION_DENIED');
        }

        const result = await this.modelInstance.where({ id: data.id, site_id: this.id }).update({ 
            name: data.name, 
            display_name: data.display_name, 
            description: data.description,
            k1: data.k1,
            k1_display_name: data.k1_display_name,
            k2: data.k2,
            k2_display_name: data.k2_display_name,
            k3: data.k3,
            k3_display_name: data.k3_display_name,
            k4: data.k4,
            k4_display_name: data.k4_display_name,
            k5: data.k5,
            k5_display_name: data.k5_display_name,
            type: 0  // 自定义监控
        });

        await this.model('custom_monitor').where({metric_id: data.id}).delete();
        return this.success(result);

    }

    async deleteAction() {

        if (!this.id) {
            return this.fail('SITE ID MISS');
        }

        const sites = await this.model('site').where({id: this.id}).select();
        if (think.isEmpty(sites)) {
            return this.fail('SITE NOT FOUND');
        }

        const { id } = this.post() || this.get();
        const metric = await this.modelInstance.where({ id: id, site_id: this.id }).select();
        if (think.isEmpty(metric)) {
            return this.fail('未找到该监控项');
        }

        if (!this.checkMetricAuth()) {
            return this.fail('PERMISSION_DENIED');
        }
        const result = await this.modelInstance.where({ id }).delete();
        await this.model('custom_monitor').where({metric_id: data.id}).delete();
        return this.success(result);
    }

    async checkMetricAuth() {
        const userInfo = await think.session('userInfo') || {};
        if (global.SUPER_ADMIN.is(userInfo.status)) {
            return true;
        }
        // 检查是否是网站管理员 / 项目成员
        if (!global.ADMIN.is(userInfo.status)) {
            const role = await this.model('site_user').where({
              user_id: userInfo.id,
              site_id: site_id
            }).find();
            if (think.isEmpty(role)) {
                return false;
            }
        }
        return true;
    }
}