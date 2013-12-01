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
        "#73dcff",
      ],
      gridColor: "#00bfff",
      gridThickness: 1
    },
  };
});