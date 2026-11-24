# Teaching Notes

- Keep the mission's design skill central. Pose the goal first and let the learner search for the circuit before showing a solution.
- Refresh linear algebra in context with worked examples, then have the learner do the arithmetic.
- Tooling path: browser lessons first, Python and Qiskit once the ideas are solid.
- Hold back famous algorithm names until the learner has attempted the underlying idea.
- Glossary: started in session 6. Add terms only after the learner demonstrates understanding.

## Learner preferences (from prior study summary)

- Introduce one unfamiliar concept at a time and explain every new symbol immediately.
- Notation: introduce each new concept in ordinary linear algebra first, as an on-ramp. Then explicitly teach the field's standard notation for it (kets, bras, ⟨ψ|φ⟩, †, ⊗, sums over basis states) and use that notation from then on. The learner wants to become fluent in it, so never skip or gloss over notation, especially when it matters. Do not *assume* notation that hasn't been taught. (Clarified by the learner in session 6.)
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
- Network: the "learn-quantum-computing" cloud environment allows YouTube, IBM Quantum Learning, jhwatrous.github.io and arXiv. YouTube blocks automated page fetches, so ground video review questions in the matching Watrous slides.
- Session 6 feedback: the assigned Watrous clip felt heavy, with general theorems, sum notation, bra-kets and daggers beyond what lessons had covered. Assign the narrowest segment possible, say explicitly which derivations to skip and which takeaways to keep, and warn about unfamiliar notation up front. Review questions should test the takeaways, not the proofs.
- Pattern: a `<section class="assignment">` before the footer (styles in `assets/course.css`), with an Assigned · Watch label, what, which part, why and what to listen for. See Lesson 6.

## Where we left off

Session 6 ran as chat only (no browser), so it has no lesson file. Starting from the uniform state with one sign flipped, the learner designed H on A, CNOT, H on A, X on A, X on B, which reads out the marked position with certainty (LR 0010). They then explained why certainty is possible, using dot products and orthogonality (LR 0011). Next: marking a position with a reversible oracle instead of a friend. The learner now understands why the inner product conjugates the first vector (S broke the plain dot product). From here on say "inner product", never "dot product". Bras were mentioned in chat but not practiced. Do not count them, or anything from the Watrous video, as learned.

**Lesson 7 is decided: notation catch-up and review, with no new ideas.** Teach each item fresh, in ordinary linear algebra first, then in notation, then practice:
- Kets: |name⟩ as a column (already in the one-qubit reference), and as a sum over basis states, e.g. |+⟩ = (|0⟩ + |1⟩)/√2
- Two-qubit kets: |ab⟩ ordering, and writing the marked states as ½(|00⟩ + |01⟩ + |10⟩ − |11⟩)
- Complex conjugate, bras ⟨ψ| as conjugate transpose, the inner product ⟨ψ|φ⟩, and why it is conjugated (S|1⟩ breaks the plain dot product)
- † for matrices, and unitary meaning U†U = I (check H and S)
- ⊗: |00⟩ = |0⟩⊗|0⟩, and H⊗H for H on both qubits
- Global phase: why −|ψ⟩ is the same state
Interleave review of the pair rule, CNOT, undoing gates and the marked-sign circuit, rewritten in the new notation. The unfinished chat question "compute ⟨ψ|ψ⟩ for S|+⟩ = (1/√2, i/√2)" belongs in this lesson. Lesson 6 (`lessons/0006-find-the-marked-sign.html`) turns this session into retrieval practice. The learner completed Lesson 6, the assigned clip and its review questions. They found the clip's derivations heavy and were told the takeaways to keep (inner product as dot product, gates preserve it, orthogonal iff perfectly distinguishable, global phase undetectable).

## Side notes

- `reference/phase-rotation.html`: S as a quarter turn in the complex plane, with animation. The learner asked for it after Lesson 5 and was excited by the connection. Add it to the reference panel in future lessons, and use it when phase returns.

## Planned path

Two-qubit states, one-qubit gates on two-qubit states, CNOT, the diffusion matrix, oracles as reversible computation, a full Grover iteration, then an original design problem.

Notation milestones, woven into that path rather than taught as a separate unit. Each one is introduced as soon as the concept it names has landed:
- Lesson 7 covers kets as sums, bras, ⟨ψ|φ⟩, †, ⊗ and global phase (see above)
- Outer products |ψ⟩⟨ψ|, needed to write the diffusion matrix as 2|u⟩⟨u| − I
- Oracle notation |x⟩|y⟩ ↦ |x⟩|y ⊕ f(x)⟩ and (−1)^f(x)
