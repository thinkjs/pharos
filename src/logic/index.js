module.exports = class extends think.Logic {
  indexAction() {

  }

  installAction() {
    this.rules = {
      step: {
        int: true,
        default: 1
      }
    };

    if (!this.isGet) {
      this.rules = think.extend({
        db_account: {
          string: true,
          requiredIf: ['step', 1]
        },
        db_name: {
          string: true,
          requiredIf: ['step', 1]
        },
        title: {
          string: true,
          requiredIf: ['step', 2]
        },
        site_url: {
          url: true,
          requiredIf: ['step', 2]
        },
        name: {
          requiredIf: ['step', 2],
          string: true,
          regexp: /[a-z0-9-_.]{4,}/i
        },
        password: {
          requiredIf: ['step', 2],
          string: true,
          length: {min: 8, max: 20}
        }
      });
    }
  }
};
