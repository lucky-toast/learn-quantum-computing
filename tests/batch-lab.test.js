// Run with: node --test tests/*.test.js
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

global.window = global;
require(path.join(__dirname, "../assets/product-lab.js"));
require(path.join(__dirname, "../assets/two-qubit-lab.js"));
require(path.join(__dirname, "../assets/batch-lab.js"));

const marked = [0, 1, 2, 3].map((m) => [0, 1, 2, 3].map((i) => (i === m ? -0.5 : 0.5)));

test("outcome returns the certain outcome, ignoring overall sign", () => {
  assert.equal(BatchLab.outcome([0, 0, -1, 0]), 2);
  assert.equal(BatchLab.outcome([0.5, 0.5, 0.5, 0.5]), -1);
});

test("run applies a circuit to any starting state", () => {
  assert.deepEqual(BatchLab.run(["X on A"], [1, 0, 0, 0]), [0, 0, 1, 0]);
});

test("distinct goal passes when each input gives a different certain outcome", () => {
  const result = BatchLab.check(["H on A", "CNOT", "H on A"], marked, { kind: "distinct" });
  assert.deepEqual(result.outcomes, [3, 2, 1, 0]);
  assert.equal(result.ok, true);
});

test("distinct goal fails when an outcome is uncertain", () => {
  assert.equal(BatchLab.check(["H on A", "H on B"], marked, { kind: "distinct" }).ok, false);
});

test("exact goal needs each input to give its expected outcome", () => {
  const expect = [0, 1, 2, 3];
  assert.equal(BatchLab.check(["H on A", "CNOT", "H on A"], marked, { kind: "exact", expect }).ok, false);
  const full = ["H on A", "CNOT", "H on A", "X on A", "X on B"];
  assert.equal(BatchLab.check(full, marked, { kind: "exact", expect }).ok, true);
});
