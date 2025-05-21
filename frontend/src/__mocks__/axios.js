const axios = {
  post: jest.fn(),
  get: jest.fn(),
  create: () => axios,
};

export default axios;