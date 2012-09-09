start
  = rule

rule
  = newVal:state sep* ":" sep* condition:disjunction {
    return function(v, h, grid) {
      if (condition(v,h,grid)) {
        return newVal;
      }
    }
  }
  / disjunction

disjunction
  = left:conjunction sep* "||" sep* right:disjunction {
    return function (v, h, grid) {
      return left(v,h,grid) || right(v,h,grid);
    }
  }
  / conjunction

conjunction
  = left:equality sep* "&&" sep* right:conjunction {
    return function (v, h, grid) {
      return left(v,h,grid) && right(v,h,grid);
    }
  }
  / equality

equality
  = neighbor:neighbor sep* "==" sep* state:state {
    return function(v, h, grid) {
      return Automaton[neighbor](v,h,grid) === state;
    }
  }
  / neighbor:neighbor {
    return function (v, h, grid) {
      return Automaton[neighbor](v,h,grid) !== 0;
    }
  }
  / state:state {
    return function (v, h, grid) {
      return Automaton.self(v,h,grid) === state;
    }
  }

neighbor
  = "NE" / "NW" / "SE" / "SW" / "N" / "S" / "E" / "W"

state
  = digits:[0-9]+ { return parseInt(digits.join(""), 10) }

sep = [' '\t\r\n]
