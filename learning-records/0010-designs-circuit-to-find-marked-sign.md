# Designs a circuit that reads out a sign-marked position

Given the uniform state with one amplitude's sign flipped, the learner explained why measuring right away reveals nothing, found that H on both qubits leaves the 11-marked state unchanged, then reused Lesson 5 backward reasoning to find H on A, CNOT, H on A. They checked it against the other marked states and added X on A and X on B so the output equals the marked position. They first validated a fix on a single case, so keep asking for a check across every input. Pair-rule arithmetic slipped twice under load, and the normalization check caught both slips, so keep prompting it.

**Evidence:** Q4–Q10 in a chat session (no browser): computed H on both from |00⟩, computed each step on the 11-, 00- and 01-marked states, and found the both-bits-flipped pattern after a counterexample.

**Implications:** The learner has not yet seen why the four marked states can be told apart with certainty. Next comes the "why" (overlaps between the marked states), then marking with a reversible oracle instead of a friend.
