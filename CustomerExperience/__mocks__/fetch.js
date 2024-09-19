const fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  }),
);

global.fetch = fetch;

export default fetch;
