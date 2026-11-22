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

Lessons 1 through 5 are complete. The learner enjoys working backward and was surprised that S returns to the start after four applications. Start the next session with a short retrieval check that includes a little matrix multiplication, then move to H on both qubits and marking an answer with a sign.

## Planned path

Two-qubit states, one-qubit gates on two-qubit states, CNOT, the diffusion matrix, oracles as reversible computation, a full Grover iteration, then an original design problem.
