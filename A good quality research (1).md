**A good quality research**

# Novelty-First Research Operating System

## A practical guide for choosing, killing, formalizing, and testing top-tier research questions in AI and language models

This guide is not about making an ordinary project sound ambitious. It is about deciding whether a research question deserves a year of work.

A strong research project makes a claim that is:

1. **surprising to the experts who know the area best;**
2. **fruitful enough to change other research;**
3. **rigorously distinguished from the strongest alternative explanations;**
4. **feasible with the actual time, people, data, and compute available.**

These four properties should be judged strictly and separately. A polished document cannot compensate for a familiar claim, and a large experimental program cannot rescue a weak intellectual move. The evaluation framework underlying this guide explicitly recommends calibrated criticism over encouragement and prefers killing a weak proposal early over discovering its weakness during execution.

---

# 1. The governing philosophy

## 1.1 Research begins with a knowledge claim, not a method

Do not begin with:

* a model architecture;
* a benchmark;
* a biological metaphor;
* a dataset;
* a new loss;
* an acronym;
* a tool you want to build.

Begin with:

> **What do I expect to show about the world that experts do not already know or expect?**

A valid one-sentence claim has the form:

> **We show that (X), contrary to the prevailing expectation (Y), because of mechanism (Z), within scope (S).**

Examples of weak openings:

> We investigate domain adaptation in language models.

> We propose a biologically inspired framework for adaptive reasoning.

> We introduce a new metric for reasoning quality.

These state a topic or method, not a scientific claim.

A sharper structure is:

> Even when two adaptation problems are matched on $(M_1,\ldots,M_k)$, their sample complexity differs by a factor of at least four because of (Z), a property absent from current theories.

The proposal is not ready when a smart reader cannot push back on the one-sentence claim. Both the evaluation rubric and the original research sharpener make this requirement explicit.

---

## 1.2 Research quality is multiplicative

A useful mental model is:

$$
Q_{\text{research}}
\approx
S \times F \times R \times E,
$$

where:

* (S) = surprise;
* (F) = fruitfulness;
* (R) = rigor;
* (E) = executability.

This is closer to a product than a sum.

* High rigor with no surprise produces a careful confirmation.
* High surprise with no rigor produces an interesting story.
* High fruitfulness with no feasibility produces a research agenda, not a project.
* High feasibility with no consequence produces an engineering exercise.
* A project with zero on any one axis is usually not top-tier research.

A “12/12” is not earned because the document contains twelve sections. It is earned because the central claim and the evidence deserve the scores.

---

## 1.3 Moonshot does not mean enormous

A moonshot is not:

* more GPUs;
* more benchmarks;
* more agents;
* a bigger DSL;
* more baselines;
* an end-to-end platform;
* fifteen partially related hypotheses.

A moonshot is:

> **A compact, consequential claim that experts currently assign low probability to, paired with an experiment capable of changing that probability.**

High-risk research should involve **epistemic risk**:

> The important claim might be false.

It should not mainly involve **engineering risk**:

> The repository may take eleven months to finish.

Engineering complexity is a tax. It is justified only when it eliminates a named alternative explanation.

---

## 1.4 Rare does not mean obscure

A genuinely rare idea must satisfy all three conditions:

1. It is difficult to reduce to an established idea.
2. It would matter if true.
3. It can be decisively tested.

An unexplored benchmark combination is not automatically a rare idea.

An unusual term is not automatically a rare idea.

A strange metaphor is not automatically a rare idea.

A useful rule is:

> **Novelty is a failed reduction to existing concepts, not an empty search result.**

A search returning no paper with your exact title proves almost nothing. The question is whether an expert can translate the idea into familiar language and say:

> “This is basically active learning.”

> “This is bisimulation with a new name.”

> “This is library learning with a stronger evaluation.”

> “This is test-time adaptation plus routing.”

If that reduction succeeds, the central idea is not yet rare enough.

---

# 2. The correct order of research

Weak projects often follow this sequence:

$$
\text{method}
\rightarrow
\text{benchmark}
\rightarrow
\text{results}
\rightarrow
\text{story}.
$$

Strong projects should follow this sequence:

$$
\boxed{
\text{phenomenon}
\rightarrow
\text{expert prior}
\rightarrow
\text{contradiction}
\rightarrow
\text{new scientific object}
\rightarrow
\text{formal separation}
\rightarrow
\text{decisive experiment}
\rightarrow
\text{algorithm}
}
$$

The algorithm is downstream of the question.

A project should not receive a name, acronym, full proposal, or implementation plan until the first six stages survive scrutiny.

---

# 3. The foundational litmus test

The strongest generic form of an AI research question is:

> **Two cases are identical under the quantities current theory uses, but behave differently. A new quantity explains and predicts the difference.**

Formally, construct two cases $(T_1)$ and $(T_2)$ such that:

$$
M_j(S,T_1)=M_j(S,T_2)
\qquad
\forall j\in{1,\ldots,k},
$$

where $(M_1,\ldots,M_k)$ are the strongest established measures or explanations.

But:

$$
C(S\rightarrow T_1)
\ll
C(S\rightarrow T_2),
$$

where (C) is the outcome that matters, such as:

* adaptation sample complexity;
* reasoning compute;
* transfer regret;
* exploration cost;
* robustness;
* creative novelty;
* recoverability;
* generalization error.

Then propose a new quantity (Z) such that:

$$
Z(S,T_1)\neq Z(S,T_2).
$$

A strong project must do more than correlate (Z) with the outcome. It should aim to show three things:

### Exact separation

Current theories cannot distinguish the matched cases.

### Prospective prediction

(Z) predicts the difference before the full outcome is observed.

### Intervention

Changing (Z), while preserving the established variables, changes the outcome.

That three-part structure turns a score into a scientific object.

---

# 4. How to discover genuinely new questions

## Step 1 — Search for assumptions, not topics

Do not ask only:

> What has not been done in domain adaptation?

Ask:

> What does nearly every domain-adaptation method assume without testing?

Examples of assumption classes include:

* the target domain already exists and can be sampled;
* the source and target use comparable variables;
* the task objective is fixed;
* the observation interface is fixed;
* the model should commit to one interpretation of the source;
* adaptation difficulty is a property of endpoint distributions;
* more information cannot make adaptation harder;
* a better source solution creates a better starting point;
* the important uncertainty is over parameters rather than over possible laws;
* the best intervention is inside a known intervention set;
* the unit that transfers is a feature, policy, skill, tool, or representation;
* the adaptation process is reversible;
* the order in which evidence arrives does not alter future learnability.

This does not mean that every assumption above is unexplored. They are examples of where to look.

The task is to identify an assumption whose negation produces a precise, non-obvious prediction.

---

## Step 2 — Begin with a phenomenon, not an analogy

Biology, psychology, philosophy, anthropology, and complex systems are useful because they contain phenomena that machine learning often does not represent.

However, import the **causal structure**, not the vocabulary.

Bad biological inspiration:

> The brain has memory, so we add memory to the model.

Better process:

1. Identify a well-defined phenomenon.
2. Determine which variables produce it.
3. Extract the causal or mathematical structure.
4. Ask which machine-learning belief that structure contradicts.
5. Derive a prediction that would not follow from the metaphor alone.

A cross-disciplinary inspiration is substantive only when removing the original biological or psychological story would still leave a precise mathematical hypothesis.

### A cross-disciplinary translation table

| Stage                 | Required question                                   | Failure mode                 |
| --------------------- | --------------------------------------------------- | ---------------------------- |
| Phenomenon            | What exactly happens in the external field?         | Vague metaphor               |
| Causal structure      | Which variable changes which outcome?               | Descriptive analogy          |
| Computational mapping | What are the AI equivalents of those variables?     | Renaming existing ML objects |
| Contradiction         | Which current expert expectation does this violate? | “It might help”              |
| Formal prediction     | What numerical or structural result follows?        | Unfalsifiable inspiration    |
| Intervention          | How can the proposed cause be manipulated directly? | Correlation-only study       |

---

## Step 3 — Generate a tournament of hypotheses

Do not emotionally commit to the first plausible idea.

Generate approximately 15–20 candidate hypotheses. Each candidate receives only one page containing:

1. the phenomenon;
2. the one-sentence claim;
3. the current expert prior;
4. the proposed contradiction;
5. the new scientific object;
6. the closest known idea;
7. one possible separation theorem;
8. one decisive experiment;
9. one reason to kill it.

Most candidates should die.

The output of ideation is not twenty proposals. It is a record showing why nineteen ideas were insufficient.

---

## Step 4 — Run the nearest-equivalence attack

For every serious candidate, ask:

> What is the strongest existing concept into which this idea can be translated?

Search across:

* the immediate AI subfield;
* adjacent machine-learning fields;
* statistics;
* learning theory;
* control;
* causal inference;
* information theory;
* cognitive science;
* neuroscience;
* philosophy of science;
* evolutionary theory;
* economics;
* complex systems.

Search the **claim**, not the project name.

Search:

* synonyms;
* older terminology;
* mathematical equivalents;
* neighboring application areas;
* recent papers;
* surveys;
* workshops;
* dissertations;
* researcher blog posts;
* negative results.

Create a table:

| Candidate claim | Nearest existing object | What is already known? | What remains open? | Does the central intuition survive? |
| --------------- | ----------------------- | ---------------------- | ------------------ | ----------------------------------- |

Kill the candidate when the central claim reduces to something experts already expect.

Do not save it by saying:

> “No one has combined all seven components before.”

Exact-conjunction novelty is usually weak novelty. Earlier evaluations in this project showed the problem clearly: a technically open conjunction can still receive only (2/3) for surprise when experts already expect the governing principle.

---

## Step 5 — State the expert prior explicitly

For every candidate, write:

> Most experts in ([specific subfield]) currently believe that \_\_\_\_\_\_.

Then write:

> Our claim predicts instead that \_\_\_\_\_\_.

A surprising result is not merely something without a published answer. It should contradict, invert, or materially refine the expert default.

The central surprise should be in the **result**, not in the method.

Weak:

> We use a new biologically inspired architecture.

Strong:

> A source model deliberately trained to retain unresolved structure adapts four times faster than an equally accurate source model trained for maximum identifiability.

The evaluation framework asks whether a senior researcher would say, “I did not expect that,” and whether the claim represents a minority position among experts.

---

## Step 6 — Require a theorem-shaped separation

Before building a large model, attempt an exact construction.

The objective is not necessarily a major formal theorem. It is a theorem-shaped statement that clarifies what must be true.

A generic form is:

> For every (m), there exist two learning problems that are identical under established quantities $(M_1,\ldots,M_k)$, but whose adaptation complexities differ by at least a factor (m).

Or:

> Any algorithm restricted to information class $(\mathcal I)$ has error at least (1/2), while one additional statistic (Z) permits exact identification.

Or:

> Under assumption (A), the established explanation predicts no difference; under the proposed mechanism, the difference is nonzero and has a registered sign.

This stage serves three purposes:

1. It proves the new object is not merely another correlated feature.
2. It reveals whether the idea is reducible to existing theory.
3. It tells the experiments exactly what must be matched.

When no separation construction can be found, the idea may still be interesting, but it has not yet earned a moonshot proposal.

---

## Step 7 — Reduce the project to one or two claims

High-quality research is usually concentrated.

A good structure is:

### Primary claim

The surprising phenomenon exists and is predicted by the new object.

### Mechanism claim

A direct intervention on the object causes the predicted change.

### Optional boundary claim

The effect disappears outside a clearly registered scope.

Avoid a proposal containing:

* one representation claim;
* one domain adaptation claim;
* one creativity claim;
* one interpretability claim;
* one robotics claim;
* one biological claim;
* one scaling claim.

That is not ambition. It is a lack of scientific focus.

---

# 5. The three-experiment standard

A sharp foundational project should usually be expressible through approximately three decisive experiments.

More experiments can be added later, but the central claim should not depend on a benchmark zoo.

## Experiment 0 — Exact separation

Purpose:

> Demonstrate that the proposed missing quantity is mathematically or causally real.

Characteristics:

* finite or analytically tractable system;
* exact computation of established quantities;
* matched cases;
* two independent implementations where possible;
* strongest established explanation given oracle access;
* no neural-network optimization needed to create the effect.

The critical baseline is often not a popular implementation. It is an **oracle version of the old theory**.

For example:

* exact first-order oracle;
* exact symmetric-interaction oracle;
* exact distribution-distance oracle;
* exact version-space oracle;
* exact policy optimum under the old information interface.

The logic is:

> Even when the established explanation receives perfect information, it cannot distinguish the matched cases.

That is much stronger than:

> Our method beat a poorly tuned baseline.

---

## Experiment 1 — Controlled prospective test

Purpose:

> Show that the proposed quantity predicts a result that was not available during development.

Required properties:

* development families and confirmatory families are separated;
* target instances are generated or revealed after the method is frozen;
* success criteria are numerical and pre-registered;
* the strongest alternative methods receive matched information and compute;
* negative-control cases are included;
* the proposed quantity is manipulated or ablated;
* the correct independent statistical unit is used.

The target should not merely be held out at the example level. The mechanism-generating family should be held out when the claim concerns generalization across mechanisms.

---

## Experiment 2 — One naturalistic replication

Purpose:

> Test whether the principle survives outside the construction designed to identify it.

Use one carefully selected external setting, not twelve loosely related benchmarks.

The naturalistic experiment should preserve:

* the same proposed object;
* the same predicted effect direction;
* the same principal intervention;
* the same scope.

Failure should narrow the claim cleanly:

> The principle is supported in controlled systems but not in the natural carrier tested.

It should not trigger a post-hoc search for another benchmark where the effect appears.

---

# 6. The rule for experimental complexity

Every experiment, baseline, ablation, or engineering component must answer:

> **Which alternative explanation does this remove?**

The original research sharpener states this directly: experiments should make the result difficult to dismiss, and every experiment should be traceable to a particular alternative explanation.

Use an objection-closure matrix:

| Alternative explanation                    | Test that distinguishes it                                 | Result required                        | Interpretation if it fails           |
| ------------------------------------------ | ---------------------------------------------------------- | -------------------------------------- | ------------------------------------ |
| Surface similarity explains the effect     | Match surface similarity while changing proposed structure | Effect follows structure               | Claim collapses to surface alignment |
| More data explains the effect              | Identical information ledger                               | Gain remains                           | No method-specific claim             |
| Generic nonlinear interaction explains it  | Exact nonlinear oracle without proposed component          | Oracle fails, proposed method succeeds | New component unnecessary            |
| Model-specific artifact                    | Independent model replication                              | Direction retained                     | Narrow to model-specific result      |
| Representation artifact                    | Independent coordinate system                              | Effect retained                        | Coordinate-dependent phenomenon      |
| Test leakage                               | Post-freeze target generation                              | Prospective success                    | Confirmatory claim invalid           |
| Proposed object is descriptive, not causal | Removal, permutation, or direct intervention               | Gain disappears predictably            | Correlation-only result              |

Do not add a component when you cannot name the objection it answers.

---

# 7. Strong controls for foundational AI research

## 7.1 Matched twins

Construct two cases that current explanations treat as identical but your proposed quantity separates.

Also construct the inverse:

* current metrics differ;
* proposed quantity is matched;
* outcome remains matched.

Together, these separate necessity from mere correlation.

---

## 7.2 Positive and negative regimes

A system that always predicts “adapt,” “compile,” “retrieve,” or “change weights” can look successful on a positive-only benchmark.

Include cases where the correct output is:

* no adaptation;
* abstention;
* escalation;
* policy change;
* information acquisition;
* mechanism absent;
* outside model scope.

A theory should know where it does **not** apply.

---

## 7.3 Direct intervention

Ablation is not always enough.

Prefer interventions such as:

* remove the proposed object;
* permute it while preserving marginal statistics;
* replace it with a surface-matched incorrect version;
* change one predicted causal relation while preserving appearance;
* implement it independently in a behaviorally equivalent form.

A causal mechanism should fail when broken and survive when reimplemented equivalently.

---

## 7.4 Strongest-old-theory oracle

Give the established theory every advantage except the proposed new ingredient.

This is the most convincing way to show that the new object is necessary.

A weak practical baseline only establishes:

> Our implementation is better.

An oracle baseline can establish:

> The old information class is insufficient.

---

## 7.5 Matched ledgers

Match methods on the resource that matters:

* labels;
* target examples;
* interaction count;
* verifier calls;
* rollouts;
* tokens;
* gradient steps;
* wall-clock;
* model size;
* access to hidden state;
* tuning effort.

Report both information-matched and compute-matched comparisons when those answer different questions.

---

## 7.6 Correct unit of analysis

Do not treat nested observations as independent.

Examples:

* 10,000 traces from four domain pairs do not equal 10,000 independent domain shifts.
* Eight model seeds on one task family do not equal eight independent mechanisms.
* Thousands of checkpoints inside one trajectory do not equal thousands of independent examples.

The independent unit should match the scope of the claim:

* domain family;
* model family;
* environment;
* language;
* causal mechanism;
* dataset pair;
* participant;
* intervention family.

Pseudo-replication is one of the easiest ways to overstate evidence.

---

## 7.7 Prospective freezing

Before confirmatory outcomes are seen, freeze:

* data roles;
* method code;
* hyperparameters;
* statistical scripts;
* success thresholds;
* target-generation seeds where possible;
* baseline admission rules;
* claim wording by outcome.

Prospective target generation is particularly strong:

> The confirmatory target does not exist until after the estimator is frozen.

---

# 8. The 12-point research-question rubric

## Gate 0 — Clarity and fit

Before scoring, answer:

### One-line description

What is this project about?

### One-sentence claim

What exactly do you expect to establish?

### Defensible scope

What systems, tasks, domains, and conditions do the experiments actually support?

### Program fit

Does this question genuinely fit the lab, fellowship, or research program, or does it merely use related keywords?

A scientifically good project in the wrong lab is still the wrong project for that lab. The original evaluation framework treats fit as a gate rather than a cosmetic section.

---

## A. Surprising to experts — 0 to 3

| Score | Standard                                                                                                         |
| ----: | ---------------------------------------------------------------------------------------------------------------- |
| **0** | The central claim is already established or widely accepted.                                                     |
| **1** | The implementation is new, but the conclusion is expected.                                                       |
| **2** | The exact claim is open and nontrivial, but experts view it as a natural extension.                              |
| **3** | The claim is a credible minority position; a positive result would force experts to revise a substantive belief. |

Questions:

* What do the closest experts currently predict?
* Does the result contradict that prediction?
* Is the surprise in the result or only in the method?
* Would the idea remain surprising without the new terminology?
* Does the strongest neighboring theory already imply the result?
* Is the project merely proving a planted phenomenon?

---

## B. Fruitfulness — 0 to 3

| Score | Standard                                                                                                                                   |
| ----: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **0** | Even if true, the result changes little.                                                                                                   |
| **1** | Useful for one benchmark or narrow technique.                                                                                              |
| **2** | Opens a meaningful subfield direction or changes a practical workflow.                                                                     |
| **3** | Changes how several communities frame a problem, creates new measurable objects, or enables previously unavailable experiments or systems. |

Questions:

* What becomes possible only after this result?
* Which current methods become questionable?
* What new research programs open?
* Would a negative result also teach something general?
* Who outside the immediate subfield updates their work?
* Does the result create a crossroads or a corridor?

The source rubric treats fruitfulness as the difference between an isolated finding and a result that changes downstream work.

---

## C. Foreclosing alternative explanations — 0 to 3

| Score | Standard                                                                                                                                                                |
| ----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0** | The evidence cannot distinguish the stated mechanism from obvious alternatives.                                                                                         |
| **1** | Correlational evidence with major uncontrolled confounds.                                                                                                               |
| **2** | Strong controls, but one important alternative remains.                                                                                                                 |
| **3** | The design directly contrasts the claimed explanation with the strongest alternatives, uses appropriate units and controls, and supports the claim at its stated scope. |

Questions:

* What are the three strongest skeptical explanations?
* Is each represented by a real baseline or intervention?
* Is the proposed mechanism manipulated directly?
* Is there a negative-control regime?
* Is the established theory given a strong or oracle baseline?
* Are data and compute budgets matched?
* Are targets prospective or genuinely held out?
* Is the independent unit correct?
* Does the evidence support the claimed generality?

The formal rubric specifically asks evaluators to list plausible alternative explanations, check seeds and statistics, inspect baselines and ablations, and prevent the claim from outrunning the experimental scope.

---

## D. Feasibility — 0 to 3

| Score | Standard                                                                                                                   |
| ----: | -------------------------------------------------------------------------------------------------------------------------- |
| **0** | The project cannot reasonably be completed with available resources.                                                       |
| **1** | Multi-person or multi-year scope disguised as a one-year project.                                                          |
| **2** | Plausible but dependent on a successful pilot or aggressive cuts.                                                          |
| **3** | A clear minimum publishable unit fits the year, dependencies are bounded, and measured pilot throughput supports the plan. |

Questions:

* What is the minimum publishable unit?
* Which components are truly necessary?
* What are the person-hour costs, not only GPU costs?
* Does the team possess the required expertise?
* Is the data available?
* Which external repositories or scorers are brittle?
* What throughput has been measured?
* What is the hard compute ceiling?
* What is cut first?
* What result remains when the stretch experiment fails?

The evaluation framework explicitly includes compute, data, expertise, timeline realism, and the tension between claim ambition and evidence burden.

---

## Score interpretation

|     Total | Decision                                        |
| --------: | ----------------------------------------------- |
| **10–12** | Strong question. Pursue after final sharpening. |
|   **7–9** | Mixed. Fix the weak criterion before execution. |
|   **4–6** | Major revision or kill.                         |
|   **0–3** | Do not pursue in the current form.              |

Any criterion scoring zero should override the total.

A (2) on surprise is not “almost perfect” when the entire ambition is to produce a surprising foundational result.

The rubric’s score ranges and critical overrides follow the source evaluation framework.

---

# 9. Common research failure modes

## Failure 1 — Familiar idea plus new terminology

Pattern:

$$
\text{known principle}
+
\text{new acronym}
+
\text{larger protocol}.
$$

Symptoms:

* the title sounds new;
* the nearest expert translates it into a familiar object;
* the novelty claim relies on the exact conjunction;
* experimental rigor is stronger than conceptual novelty.

Response:

> Kill or deepen the question. Do not add another engineering layer.

---

## Failure 2 — Method-first research

Pattern:

> We have technique (X). Where can we apply it?

This often produces benchmark papers, not discoveries.

Response:

> Identify the phenomenon first. The method should be the smallest tool that can test it.

---

## Failure 3 — Benchmark-first research

Pattern:

> Performance is weak on dataset (Y); let us design an adaptation method.

A benchmark gap is not automatically a knowledge gap.

Response:

> Ask what general scientific uncertainty the benchmark instantiates.

---

## Failure 4 — Conjunction novelty

Pattern:

> No prior paper combines active learning, a verifier, a DSL, two model families, and a held-out objective.

The exact combination may be new while every important intuition is known.

Response:

> State the central conclusion without implementation details. Re-run the novelty audit on that sentence.

---

## Failure 5 — Engineering gravity

Pattern:

* sealed foundry;
* several DSLs;
* fifteen baselines;
* multiple model families;
* robotics and LLM experiments;
* human annotations;
* extensive RedTeam;
* new theorem;
* new training algorithm.

The experiment becomes the year, while the question remains familiar.

Response:

> Protect only the decisive experiment. Cut everything that does not remove a named confound.

---

## Failure 6 — Baseline zoo as camouflage

Many baselines do not make a claim more novel.

A single exact oracle of the established theory can be more informative than twenty ordinary implementations.

Response:

> Choose baselines by explanatory role, not by count.

---

## Failure 7 — Multiple central claims

A project simultaneously claims:

* a new representation;
* a new learning law;
* a new benchmark;
* a new biological theory;
* a new adaptation algorithm;
* a new interpretability result.

Response:

> Select the one result that should make an expert update. Make everything else subordinate.

---

## Failure 8 — Self-awarded perfection

A proposal author should not treat their own internal audit as evidence that the design is (12/12).

Response:

> Separate author self-check from hostile external evaluation. Feasibility and novelty are earned by pilots and literature attacks, not prose.

---

## Failure 9 — Scale mistaken for rigor

Running more models and benchmarks can establish robustness. It cannot by itself establish mechanism.

Response:

> Prefer a matched causal construction over a broad but ambiguous benchmark sweep.

---

## Failure 10 — Biological garnish

The proposal uses terms such as evolution, cognition, homeostasis, development, or embodiment, but the formalism and experiment would be unchanged without them.

Response:

> Either remove the biological framing or derive a prediction uniquely from the external phenomenon.

---

# 10. Kill conditions every project should have

A strong project includes reasons to stop.

## Novelty kill

A prior work is found that establishes the central claim or reduces it to an existing object.

## Theorem kill

The proposed matched separation cannot be constructed, or the old theory can distinguish the supposedly identical cases.

## Pilot kill

The proposed quantity cannot be estimated at the registered signal-to-noise level.

## Baseline kill

A generic model, exact existing-theory oracle, or full-system identifier matches the proposed method under the same information budget.

## Mechanism kill

Removing or perturbing the proposed mechanism does not remove the effect.

## Negative-control kill

The method reports the same advantage in regimes where the theory predicts no effect.

## Scope kill

The effect exists only in a planted family and fails the registered external carrier.

## Feasibility kill

Measured throughput, annotation burden, or engineering dependencies exceed the hard budget.

## Alignment kill

The project is scientifically respectable but does not compound with the intended lab or program.

A kill condition is not a failure of research. It is evidence that the research process is working.

---

# 11. The daily operating system for a researcher or agent

## Every morning

Write five sentences:

1. **Claim:** What exactly am I trying to establish?
2. **Expert prior:** What would the nearest expert predict?
3. **Nearest equivalent:** What existing idea most threatens novelty?
4. **Killer alternative:** What simpler explanation could produce my expected result?
5. **Kill condition:** What finding today would make me abandon or materially narrow the idea?

When these answers become vague, stop coding.

---

## While reading papers

Do not summarize only what each paper does.

Record:

* what the paper assumes;
* what it holds fixed;
* what it cannot distinguish;
* what evidence would falsify it;
* what object it treats as fundamental;
* where the scope ends;
* whether its result is causal, predictive, or descriptive;
* which variables are observed only after the target appears;
* which negative cases are missing.

A useful literature note has this structure:

| Field       | Entry                                                 |
| ----------- | ----------------------------------------------------- |
| Claim       | What does the paper establish?                        |
| Assumptions | What must be true?                                    |
| Object      | What mathematical or computational object is central? |
| Evidence    | What distinguishes the claim from alternatives?       |
| Boundary    | Where does it not apply?                              |
| Opening     | Which assumption could be reversed?                   |
| Threat      | How close is it to my candidate?                      |

---

## Before every experiment

Complete this sentence:

> This experiment exists to rule out the explanation that \_\_\_\_\_\_.

Then specify:

* manipulation;
* control;
* measured variable;
* independent unit;
* success threshold;
* failure interpretation.

When the blank cannot be filled precisely, the experiment is likely decorative.

---

## At the end of each day

Update four ledgers:

### Claim ledger

What claim is currently supported, unsupported, or weakened?

### Novelty ledger

Which neighboring ideas were found, and how do they change the novelty boundary?

### Kill ledger

Which candidates or components were eliminated and why?

### Decision ledger

What changed, when, using which information, and before or after seeing which outcomes?

---

## Every week

Run a hostile review.

Ask one person—or one deliberately adversarial agent—to argue:

* the idea is already known;
* the result would be expected;
* the experiment cannot identify the mechanism;
* the baseline is unfair;
* the statistical unit is wrong;
* the project is too large;
* the lab fit is superficial;
* the result would not matter.

Do not ask the reviewer to improve the idea until they have first tried to kill it.

---

# 12. Practical research artifacts to maintain

A disciplined project should maintain the following files from the beginning:

```text
CLAIM.md
```

Contains the one-sentence claim, exact scope, expert prior, and non-claims.

```text
CANDIDATE_TOURNAMENT.md
```

Contains all candidate ideas, their nearest equivalents, and why most were killed.

```text
NOVELTY_AUDIT.md
```

Contains the literature search strategy, nearest five works, conceptual reductions, and surviving novelty boundary.

```text
THEORY.md
```

Contains the matched separation, definitions, propositions, and counterexamples.

```text
EXPERIMENT_OBJECTION_MATRIX.md
```

Maps every experiment and ablation to the alternative explanation it addresses.

```text
PREREGISTRATION.yaml
```

Contains data roles, freeze points, thresholds, seeds, units, baselines, and success conditions.

```text
KILL_TREE.md
```

States exactly when the project, mechanism claim, or generalization claim must stop.

```text
DECISION_LEDGER.md
```

Records every nontrivial change and whether confirmatory outcomes had been accessed.

```text
FEASIBILITY_PILOT.md
```

Contains measured throughput, memory, annotation time, failure rates, and the final hard resource cap.

These artifacts prevent an attractive story from replacing the actual scientific record.

---

# 13. A compact research-question template

## Title

Use a descriptive title. Do not depend on an acronym to create novelty.

## One-line project description

> We study whether \_\_\_\_\_\_.

## One-sentence claim

> We expect to show that \_\_\_\_\_\_, contrary to \_\_\_\_\_\_, because \_\_\_\_\_\_, within \_\_\_\_\_\_.

## Expert prior

> Most researchers in \_\_\_\_\_\_ currently expect \_\_\_\_\_\_.

## Surprise

> The result that should make them update is \_\_\_\_\_\_.

## Defensible scope

> The evidence supports claims only for \_\_\_\_\_\_.

## Established explanations

$$
M_1,\ldots,M_k
$$

## New object

$$
Z=\text{\_\_\_\_\_\_}
$$

## Separation statement

$$
M_j(T_1)=M_j(T_2)\quad\forall j,
$$

but

$$
Y(T_1)\neq Y(T_2),
$$

and

$$
Z(T_1)\neq Z(T_2).
$$

## Primary experiment

> Manipulate (Z), match $(M_1,\ldots,M_k)$, and measure (Y).

## Strongest alternative explanation

> The effect might instead be caused by \_\_\_\_\_\_.

## Decisive control

> We rule that out by \_\_\_\_\_\_.

## Primary success threshold

> The claim passes only when \_\_\_\_\_\_.

## Kill condition

> We abandon or narrow the claim when \_\_\_\_\_\_.

## Minimum publishable unit

> The smallest complete paper consists of \_\_\_\_\_\_.

## Stretch work

> Only after the core passes, test \_\_\_\_\_\_.

---

# 14. Instructions for an AI research agent

The following can be used as an operating prompt for a research agent.

## Research-agent protocol

1. **Do not begin by proposing methods.** Begin by identifying an unresolved phenomenon and a precise knowledge claim.
2. **Do not generate an acronym or full proposal until the idea survives a hostile novelty audit.**
3. **State the expert prior.** Identify the exact researchers or subfield whose expectation the claim contradicts.
4. **Search conceptually, not lexically.** Search synonyms, mathematical equivalents, adjacent fields, old terminology, recent work, and negative results.
5. **Treat absence of an exact phrase as no evidence of novelty.**
6. **Attempt to reduce the idea to the strongest existing concepts.** Kill it when the reduction preserves the central claim.
7. **Do not rely on exact-conjunction novelty.** A new combination of familiar components is insufficient unless the combination yields a genuinely unexpected principle.
8. **Generate many candidates and protect none of them.** Keep a tournament and record why candidates die.
9. **Import causal structures from biology, psychology, philosophy, or other fields—not surface metaphors.**
10. **Require a theorem-shaped separation before large-scale experimentation.**
11. **Design matched cases where established quantities agree but the proposed quantity and outcome differ.**
12. **Use the strongest existing theory as an oracle baseline whenever possible.**
13. **Limit the core to one primary claim, one mechanism claim, and at most one external-validity claim.**
14. **Design approximately three decisive experiments:** exact separation, prospective controlled test, and one naturalistic replication.
15. **Map every experiment to a named alternative explanation.**
16. **Use positive, negative, abstention, and outside-scope regimes.**
17. **Match information, compute, tuning effort, and interaction budgets.**
18. **Use the correct independent unit and avoid pseudo-replication.**
19. **Freeze confirmatory targets, analysis code, and thresholds before outcomes are opened.**
20. **Pre-register outcome-dependent claim language.** Do not force a positive story.
21. **Separate the minimum publishable unit from stretch experiments.**
22. **Estimate person-hours and engineering dependencies, not only GPU-hours.**
23. **Require a measured end-to-end pilot before unlocking the full experiment.**
24. **Maintain explicit novelty, theorem, pilot, mechanism, baseline, scope, and feasibility kill conditions.**
25. **Do not declare the proposal perfect.** Produce a calibrated score and identify what remains unearned.
26. **When no candidate survives, report that honestly and continue ideating.** Do not manufacture a proposal to satisfy the process.

---

# 15. High-yield question generators

These are not research proposals. They are lenses for discovering questions.

## The indistinguishable-worlds lens

What two situations appear identical to current metrics but require radically different adaptation?

## The hidden-assumption lens

What does nearly every method hold fixed without justification?

## The irreversible-learning lens

What source-learning decision destroys future adaptive options?

## The history lens

Can two systems with identical present states have different future learnability because of how they arrived there?

## The counterfactual lens

What important property cannot be inferred from passive observations but can be identified by one carefully chosen intervention?

## The objective-change lens

Does a learned object remain useful when the objective is created only after learning ends?

## The anti-performance lens

Can a deliberately worse source model, representation, or policy adapt better later? Under what exact conditions?

## The negative-information lens

Can additional source information reduce future adaptability by forcing premature commitment?

## The problem-transformation lens

Can an adaptive system change the representation, interface, or ontology of the problem rather than merely solve within it?

## The latent-capacity lens

Which variable determines how easily a system can acquire a capability it does not yet possess?

## The non-identifiability lens

What multiple future laws remain consistent with the source, and how does the target resolve them?

## The collective lens

Can adaptation emerge from interactions among individually non-adaptive components?

## The developmental lens

Is there a machine-learning analogue of critical periods, differentiation, or retained plasticity that produces a prediction not captured by optimization geometry?

## The ecological lens

Does an agent adapt only to a domain, or does its behavior alter the domain that future learning encounters?

## The cultural lens

Can knowledge transfer depend more on transmitted learning procedures than on transmitted solutions?

The purpose of these lenses is to produce contradictions and formal objects, not metaphors.

---

# 16. Final pre-project checklist

A project should not enter full implementation until the following answers are mostly “yes.”

## Claim

* [ ] Can the contribution be stated in one falsifiable sentence?
* [ ] Does the sentence state a result rather than a method?
* [ ] Is the scope explicit?
* [ ] Are non-claims stated?

## Surprise

* [ ] Is the current expert prior written down?
* [ ] Does the proposed result contradict or materially refine it?
* [ ] Would the claim remain surprising without its acronym?
* [ ] Is the surprise stronger than “no one combined these components”?
* [ ] Has the nearest-equivalence attack failed?

## Literature

* [ ] Were synonyms and adjacent fields searched?
* [ ] Were the closest recent works identified?
* [ ] Was contradictory literature included?
* [ ] Was the idea compared at the level of its central intuition?
* [ ] Is novelty distinguished from implementation difference?

## Formal structure

* [ ] Is there a new quantity, object, or relation?
* [ ] Can matched cases be constructed?
* [ ] Can current theories be given oracle access and still fail?
* [ ] Is there a theorem-shaped separation or impossibility claim?
* [ ] Are the assumptions explicit?

## Experiments

* [ ] Does each experiment rule out a named alternative explanation?
* [ ] Is there a direct intervention on the proposed mechanism?
* [ ] Are there negative controls?
* [ ] Are information and compute budgets matched?
* [ ] Are confirmatory targets prospective or genuinely held out?
* [ ] Is the independent unit correct?
* [ ] Are success thresholds numerical?
* [ ] Are failure interpretations predeclared?
* [ ] Is one naturalistic replication sufficient and relevant?

## Fruitfulness

* [ ] Does the result change more than one downstream research decision?
* [ ] Does it create a new measurable object or complexity notion?
* [ ] Would a strong negative result still resolve an important uncertainty?
* [ ] Can specific communities that would build on it be named?
* [ ] Does it open questions that were not already obvious?

## Feasibility

* [ ] Is the minimum publishable unit executable in one year?
* [ ] Are person-hours estimated?
* [ ] Are required skills available?
* [ ] Are data and evaluation infrastructure available?
* [ ] Has an end-to-end pilot been defined?
* [ ] Is there a hard resource cap?
* [ ] Is stretch work separated from the core?
* [ ] Are kill conditions real?

## Research integrity

* [ ] Are all major choices frozen before confirmatory outcomes?
* [ ] Is post-hoc analysis clearly separated?
* [ ] Are null and negative outcomes reportable?
* [ ] Is claim wording conditional on the result?
* [ ] Is the project being evaluated by a hostile reviewer rather than only by its author?

The original sharpener’s final instruction is the right default: use this discipline before every project; when the first sections feel forced, the question is not ready and ideation should continue.

---

# 17. The shortest version

A top-tier AI research question should satisfy this sequence:

$$
\boxed{
\begin{aligned}
&\text{Identify an expert assumption.}\\
&\text{Construct cases current theory cannot distinguish.}\\
&\text{Introduce one new object that separates them.}\\
&\text{Prove the distinction in a tractable setting.}\\
&\text{Predict it prospectively.}\\
&\text{Manipulate it causally.}\\
&\text{Test it once outside the construction.}\\
&\text{Kill the project if the strongest old explanation survives.}
\end{aligned}
}
$$

The goal is not to make every idea survive.

The goal is to kill familiar, inconsequential, unidentifiable, or infeasible ideas quickly enough that one rare, important, and testable question remains.
