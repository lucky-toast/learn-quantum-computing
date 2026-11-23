# Teaching Notes

- Keep the mission's design skill central. Pose the goal first and let the learner search for the circuit before showing a solution.
- Refresh linear algebra in context with worked examples, then have the learner do the arithmetic.
- Tooling path: browser lessons first, Python and Qiskit once the ideas are solid.
- Hold back famous algorithm names until the learner has attempted the underlying idea.
- Glossary: not started. Add terms only after the learner demonstrates understanding.

## Learner preferences (from prior study summary)

- Introduce one unfamiliar concept at a time and explain every new symbol immediately.
- Translate quantum notation into ordinary linear algebra. Do not assume Dirac notation or tensor products.
- Prefer deriving results from first principles. Give hints before answers.
- Distinguish mathematical definitions, physical postulates, and experimental evidence.
- Correct misunderstandings explicitly, including tutor mistakes.
- Check conceptual understanding, not just arithmetic.
- Wants the physical meaning of the math.
- Every lesson includes the in-page reference panel (`assets/reference-drawer.js`), so the learner never has to switch tabs. Tag answers in reference sheets with `data-after-lesson` so the panel cannot spoil the current lesson.
- State plainly what each exercise gives and what it asks for, including any limits. Avoid arbitrary limits that can block a valid solution.
- Keep chat explanations short. Long breakdowns of optional detail go unread.
- Enjoys seeing the minimal solution after solving a puzzle. Verify minimality by exhaustive search before claiming it.

## Where we left off

Session 6 ran as chat only (no browser), so it has no lesson file. Starting from the uniform state with one sign flipped, the learner designed H on A, CNOT, H on A, X on A, X on B, which reads out the marked position with certainty (LR 0010). Open question: *why* certainty is possible. Next, teach overlaps (inner products) between the four marked states, then marking a position with a reversible oracle. A future HTML lesson should turn this chat session into practice with retrieval.

## Side notes

- `reference/phase-rotation.html`: S as a quarter turn in the complex plane, with animation. The learner asked for it after Lesson 5 and was excited by the connection. Add it to the reference panel in future lessons, and use it when phase returns.

## Planned path

Two-qubit states, one-qubit gates on two-qubit states, CNOT, the diffusion matrix, oracles as reversible computation, a full Grover iteration, then an original design problem.
