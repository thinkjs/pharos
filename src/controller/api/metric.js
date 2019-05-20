const Base = require('./base');

module.exports = class extends Base {
    constructor(...args) {
        super(...args);
        this.modelInstance = this.model('metric');
    }

    async getAction() {

        const { page = 1, pagesize = 50, keywords, site_id } = this.get();
        const isSuperAdmin = global.SUPER_ADMIN.is(this.userInfo.status);
        if (!isSuperAdmin) {
            
        }

        let result;

        if (keywords) {
            result = await this.modelInstance.where({
                site_id, 
                display_name: ['like', `%${keywords}%`]
            }).page([page, pagesize]).countSelect();
        } else {
            result = await this.modelInstance.page([page, pagesize]).countSelect();
        }

        return this.success(result);
    }

    async postAction() {
        const data = this.post();
        const sites = await this.model('site').where({id: data.site_id}).select();
        if (think.isEmpty(sites)) {
            return this.fail('SITE NOT FOUND');
        }
        
        const result = await this.modelInstance.addMetric(data);
        this.success(result);
    }
}