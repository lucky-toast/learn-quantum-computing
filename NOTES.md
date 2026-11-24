# Teaching Notes

- Keep the mission's design skill central. Pose the goal first and let the learner search for the circuit before showing a solution.
- Refresh linear algebra in context with worked examples, then have the learner do the arithmetic.
- Tooling path: browser lessons first, Python and Qiskit once the ideas are solid.
- Hold back famous algorithm names until the learner has attempted the underlying idea.
- Glossary: started in session 6. Add terms only after the learner demonstrates understanding.

## Learner preferences (from prior study summary)

- Introduce one unfamiliar concept at a time and explain every new symbol immediately.
- Translate quantum notation into ordinary linear algebra. Do not assume Dirac notation or tensor products.
- Prefer deriving results from first principles. Give hints before answers.
- Distinguish mathematical definitions, physical postulates, and experimental evidence.
- Correct misunderstandings explicitly, including tutor mistakes.
- Check conceptual understanding, not just arithmetic.
- Wants the physical meaning of the math.
- Asset logic gets a Node test first (`node --test tests/*.test.js`), following the learner's TDD preference.
- Every lesson includes the in-page reference panel (`assets/reference-drawer.js`), so the learner never has to switch tabs. Tag answers in reference sheets with `data-after-lesson` so the panel cannot spoil the current lesson.
- State plainly what each exercise gives and what it asks for, including any limits. Avoid arbitrary limits that can block a valid solution.
- Keep chat explanations short. Long breakdowns of optional detail go unread.
- Enjoys seeing the minimal solution after solving a puzzle. Verify minimality by exhaustive search before claiming it.

## External resources (stated in session 6)

- The learner had not realized "Read next" was meant for them, and has not used any external source yet.
- Prefers video or audio over reading. Text is fine when nothing better exists.
- An assigned resource needs its own clearly labeled, prominent section in the lesson, not a footer line. Say what to watch, which part (timestamps), roughly how long it takes, and why.
- Pair each assigned resource with review questions about that resource specifically. Write them only from content you have verified (slides, transcript or chapter list), never from memory. If the content cannot be checked, skip the questions (the learner said they are optional).
- Lessons 1–5 had only a footer "Read next" line, which the learner never used. Those lines were removed in session 6 at their request; do not assign catch-up material for them.
- Pattern: a `<section class="assignment">` before the footer (styles in `assets/course.css`), with an Assigned · Watch label, what, which part, why and what to listen for. See Lesson 6.

## Where we left off

Session 6 ran as chat only (no browser), so it has no lesson file. Starting from the uniform state with one sign flipped, the learner designed H on A, CNOT, H on A, X on A, X on B, which reads out the marked position with certainty (LR 0010). They then explained why certainty is possible, using dot products and orthogonality (LR 0011). Next: marking a position with a reversible oracle instead of a friend. Teach the complex dot product before phase gates return. Lesson 6 (`lessons/0006-find-the-marked-sign.html`) turns this session into retrieval practice. The learner plans to go through it before the next session, so start by asking how it went.

## Side notes

- `reference/phase-rotation.html`: S as a quarter turn in the complex plane, with animation. The learner asked for it after Lesson 5 and was excited by the connection. Add it to the reference panel in future lessons, and use it when phase returns.

## Planned path

Two-qubit states, one-qubit gates on two-qubit states, CNOT, the diffusion matrix, oracles as reversible computation, a full Grover iteration, then an original design problem.
