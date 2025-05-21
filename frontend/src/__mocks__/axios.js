jest.mock('axios', () => ({
  get: jest.fn(),
  put: jest.fn(),
}));