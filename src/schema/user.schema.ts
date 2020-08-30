const Validator = require('fastest-validator');
const v = new Validator();

export class UserSchema {
  async updateUserSchema(data) {
    const schema = {
      fullName: { type: 'string', min: 3, max: 255, optional: true },
      email: { type: 'email', optional: true },
      password: { type: 'string', min: 3, max: 255, optional: true },
      address: { type: 'string', min: 3, max: 255, optional: true },
    };

    return await v.validate(data, schema);
  }
}
