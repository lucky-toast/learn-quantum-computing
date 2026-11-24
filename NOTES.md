# Teaching Notes

Working notes for `/teach`. What the learner *knows* lives in `learning-records/` and `GLOSSARY.md`. This file holds how to teach, the course path, and anything in flight.

## Scope

See `MISSION.md`. Long term: all of quantum computing. For now: the basics, at the level of an intro college course. Watrous's course (`RESOURCES.md`) is the map for that scope. Its Units I and II are the core, and Unit IV's opening lesson closes the course.

## How to teach

- Pose the goal first and let the learner search for the circuit before showing a solution. Designing from a goal is the skill the mission is built on.
- Introduce one unfamiliar concept at a time, and explain every new symbol right away.
- Derive results from first principles. Give hints before answers.
- Distinguish mathematical definitions, physical postulates and experimental evidence.
- Give the physical meaning of the math.
- Check conceptual understanding, not just arithmetic.
- Correct misunderstandings explicitly, including tutor mistakes.
- Refresh linear algebra in context with worked examples, then have the learner do the arithmetic.
- Keep chat explanations short. Long breakdowns of optional detail go unread.
- State plainly what each exercise gives and what it asks for, including any limits. Avoid arbitrary limits that can block a valid solution.
- After the learner solves a puzzle, show the minimal solution. Verify minimality by exhaustive search before claiming it.

## Notation

- Introduce each concept in ordinary linear algebra first, as an on-ramp. Then teach the field's standard notation for it and use that notation from then on. The learner wants fluency, so never skip or gloss over notation.
- Never *assume* notation that hasn't been taught.
- "Dot product" and "inner product" are both fine. Both always mean the conjugated version, a*c + b*d. Never present the plain, unconjugated sum as the whole story.

## Named algorithms and results

Names are fine. Good practice: have the learner derive or design the idea first, then explain what it is and give its name.

## Spaced review

Required in every lesson. Baseline: each lesson opens with a short warm-up of retrieval questions drawn from lessons at least two back, mixed across topics, before any new material. (Mechanism beyond this baseline: pending the learner's choice.)

## External resources

- Prefers video or audio over reading. Text is fine when nothing better exists.
- An assigned resource gets its own prominent `<section class="assignment">` before the footer (styles in `assets/course.css`, example in Lesson 6). It says what to watch, which part, roughly how long it takes, why, and what to listen for.
- Assign the narrowest segment possible. Say which derivations to skip and which takeaways to keep, and warn about unfamiliar notation up front.
- Pair each assigned resource with review questions about that resource. Write them only from content you have verified (slides, transcript or chapter list), never from memory. If it cannot be checked, skip the questions (the learner said they are optional). Questions test the takeaways, not the proofs.
- Watrous is pitched at a graduate intro course. The learner found it heavy partly because they had no notation yet. Keep using it, with notation taught first, and look for gentler videos too (see Gaps in `RESOURCES.md`).
- Network: the "learn-quantum-computing" cloud environment allows YouTube, IBM Quantum Learning, jhwatrous.github.io and arXiv. YouTube blocks automated page fetches, so ground video questions in the matching Watrous slides.
- Lessons 1–5 have no assigned resource, at the learner's request. Do not assign catch-up material for them.

## Lesson building

- Asset logic gets a Node test first (`node --test tests/*.test.js`), following the learner's TDD preference.
- Every lesson includes the in-page reference panel (`assets/reference-drawer.js`). It opens on the last sheet in `data-sheets`, so list the newest sheet last. Include `reference/phase-rotation.html`, which the learner asked for and likes.
- In reference sheets, tag answers with `data-after-lesson` so the panel cannot spoil the current lesson.

## Current status

- Last completed: Lesson 6 and its assigned clip.
- Built, not yet done: Lesson 7 (`lessons/0007-speak-the-notation.html`), notation review with no new ideas. When the learner reports back, check which notation landed. Then write learning records, and add terms to the glossary (bras, ⟨ψ|φ⟩, †, ⊗ and global phase are not yet in it).

## Course path

Ordered by Watrous's units, adjusted so the learner's in-progress search thread lands before phase estimation. ✓ = done. Notation is taught where its concept first appears.

1. **Single and multiple systems** (Watrous L1–L2)
   - ✓ One qubit: states, measurement, H, X, Z, S and phase (Lessons 1, 5)
   - ✓ Two qubits: ordering, gates on one qubit, CNOT, entanglement, undoing gates (Lessons 2–5)
   - ✓ Telling states apart: inner product and orthogonality (Lesson 6)
   - Notation review: kets, bras, ⟨ψ|φ⟩, †, ⊗, global phase (Lesson 7, built)
   - Measuring one qubit of two, and what the other qubit is left in
   - Probabilistic (classical) states versus quantum states
2. **Quantum circuits** (Watrous L3)
   - Three qubits, Toffoli, reversible classical computation
   - No-cloning
   - First Qiskit lesson (proposed): predict a circuit by hand, then check it in a simulator
3. **Entanglement in action** (Watrous L4): teleportation, superdense coding, the CHSH game
4. **Query algorithms** (Watrous L5)
   - Oracles and phase kickback. Notation: |x⟩|y⟩ ↦ |x⟩|y ⊕ f(x)⟩ and (−1)^f(x)
   - Deutsch, Deutsch–Jozsa, Bernstein–Vazirani, Simon
5. **Search** (Watrous L8)
   - Diffusion. Notation: outer products |ψ⟩⟨ψ|, and 2|u⟩⟨u| − I
   - A full Grover iteration, how many iterations, and an original design problem
6. **Algorithmic foundations** (Watrous L6): cost of circuits, and simulating classical computation
7. **Phase estimation and factoring** (Watrous L7): quantum Fourier transform, phase estimation, Shor
8. **Noise and error correction, first look** (Watrous L13): the repetition code and correcting a bit flip

Beyond the intro scope, for later: density matrices, channels, general measurements (Watrous Unit III), and the stabilizer formalism and fault tolerance (Unit IV).
