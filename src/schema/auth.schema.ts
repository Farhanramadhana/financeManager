const Validator = require('fastest-validator');
const v = new Validator();

export class AuthSchema {
  async registrationSchema(data) {
    const schema = {
      fullName: { type: 'string', min: 3, max: 255 },
      email: { type: 'email' },
      password: { type: 'string', min: 3, max: 255 },
      address: { type: 'string', min: 3, max: 255 },
    };

    return await v.validate(data, schema);
  }

  async login(data) {
    const schema = {
      email: { type: 'email' },
      password: { type: 'string', min: 3, max: 255 },
    };

    return await v.validate(data, schema);
  }
}
