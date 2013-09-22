define([
  "automaton/rules/seeds",
  "automaton/seeds/default"
], function (rules, seed) {
  return {
    rules: rules,
    seed: seed,
    artistSettings: {
      background: "#000000",
      colors: [
        null,
        "#003555",
      ],
      gridColor: "#000000",
      gridThickness: 1
    },
  };
});