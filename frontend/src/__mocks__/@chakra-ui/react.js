const chakraMock = new Proxy({}, {
  get: (_, key) => {
    if (key === '__esModule') return true;
    if (key === 'useColorModeValue') return (light, dark) => light;
    if (key === 'ChakraProvider') return ({ children }) => children;
    return key;
  },
});

export default chakraMock;
