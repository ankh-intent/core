
let pit = (text, provider, block) => {
  let data = provider();

  for (let test of data) {
    it(text, () => {
      return block(test());
    });
  }
};

export {
  pit,
}
