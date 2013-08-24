importScripts("underscore.js", "automaton.js", "automaton-rule-parser.js");

self.rules = [];

function updateRules(rules) {
  Rules = _.map(rules, function (rule) {
    return Automaton.RuleParser.parse(rule);
  });
}

self.handlers = {
  updateRules: function (data) {
    self.rules = _.map(data.rules, function (rule) {
      return Automaton.RuleParser.parse(rule);
    });
    self.postMessage({type: "ack rules"});
  },
  updateGrid: function (data) {
    self.postMessage({type: "new grid", grid: Automaton.update(data.grid, self.rules)});
  }
}

self.addEventListener("message", function (event) {
  self.handlers[event.data.type](event.data);
});

postMessage("ready!");
