const handlebarsHelpers = {
  count: (num) => {
    num += 1;

    return num;
  },
  checkLength: (arr) => arr.length,

};

module.exports = {
  handlebarsHelpers,
};
