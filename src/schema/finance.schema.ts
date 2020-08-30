const Validator = require('fastest-validator');
const v = new Validator();

export class FinanceSchema {
  async createFinanceAccountSchema(data) {
    const schema = {
      accountName: { type: 'string', min: 3, max: 255 },
      balance: { type: 'number' },
      type: { type: 'string', min: 3, max: 50 },
      description: { type: 'string', min: 3, max: 255, optional: true },
    };

    return await v.validate(data, schema);
  }

  async updateFinanceAccountSchema(data) {
    const schema = {
      id: { type: 'string', min: 36, max: 36 },
      accountName: { type: 'string', min: 3, max: 255, optional: true },
      balance: { type: 'number', optional: true },
      type: { type: 'string', min: 3, max: 50, optional: true },
      description: { type: 'string', min: 3, max: 255, optional: true },
      isDeleted: { type: 'boolean', optional: true },
    };

    return await v.validate(data, schema);
  }

  async createFinanceTransactionSchema(data) {
    const schema = {
      transactionName: { type: 'string', min: 3, max: 255 },
      amount: { type: 'number' },
      description: { type: 'string', min: 3, max: 255, optional: true },
      financeAccount: { type: 'string', min: 3, max: 255 },
      type: [
        { type: 'equal', value: 'income' },
        { type: 'equal', value: 'outcome' },
      ],
    };
    return await v.validate(data, schema);
  }

  async updateFinanceTransactionSchema(data) {
    const schema = {
      id: { type: 'string', min: 36, max: 36 },
      transactionName: { type: 'string', min: 3, max: 255, optional: true },
      amount: { type: 'number', optional: true },
      description: { type: 'string', min: 3, max: 255, optional: true },
      financeAccount: { type: 'string', min: 3, max: 255, optional: true },
      type: [
        { type: 'equal', value: 'income', optional: true },
        { type: 'equal', value: 'outcome', optional: true },
      ],
      isDeleted: { type: 'boolean', optional: true },
    };
    return await v.validate(data, schema);
  }
}
