define([
  "automaton/rules/seeds",
  "automaton/seeds/default"
], function (rules, seed) {
  return {
    rules: rules,
    seed: seed,
    artistSettings: {
      background: null,
      colors: [
        null,
        "#eafaff"
      ],
      gridColor: "#fafafa",
      gridThickness: 1
    },
  };
});
