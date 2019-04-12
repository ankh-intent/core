
const pit = (text, provider, block) => {
  const data = provider();

  for (const test of data) {
    it(text, () => {
      return block(test());
    });
  }
};

export {
  pit,
}
