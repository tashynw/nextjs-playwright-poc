const { faker } = require("@faker-js/faker");

export const mockUserData = (overrides = {}) => {
  return {
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    email: `tester${faker.string.uuid()}@testpoc.com`,
    password: "Password!23",
    ...overrides,
  };
};
