**A good quality research**



# Novelty-First Research Operating System



## A practical guide for choosing, killing, formalizing, and testing top-tier research questions in AI and language models



This guide is not about making an ordinary project sound ambitious. It is about deciding whether a research question deserves a year of work.



A strong research project makes a claim that is:



1. **surprising to the experts who know the area best;**

2. **fruitful enough to change other research;**

3. **rigorously distinguished from the strongest alternative explanations;**

4. **feasible with the actual time, people, data, and compute available.**



These four properties should be judged strictly and separately. A polished document cannot compensate for a familiar claim, and a large experimental program cannot rescue a weak intellectual move. The[...]



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



> Even when two adaptation problems are matched on (M_1,\ldots,M_k), their sample complexity differs by a factor of at least four because of (Z), a property absent from current theories.



The proposal is not ready when a smart reader cannot push back on the one-sentence claim. Both the evaluation rubric and the original research sharpener make this requirement explicit.  



---



## 1.2 Research quality is multiplicative



A useful mental model is:



\[

Q_{\text{research}}

\approx

S \times F \times R \times E,

\]



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



\[

\text{method}

\rightarrow

\text{benchmark}

\rightarrow

\text{results}

\rightarrow

\text{story}.

\]



Strong projects should follow this sequence:



\[

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

\]



The algorithm is downstream of the question.



A project should not receive a name, acronym, full proposal, or implementation plan until the first six stages survive scrutiny.



---



# 3. The foundational litmus test



The strongest generic form of an AI research question is:



> **Two cases are identical under the quantities current theory uses, but behave differently. A new quantity explains and predicts the difference.**



Formally, construct two cases (T_1) and (T_2) such that:



\[

M_j(S,T_1)=M_j(S,T_2)

\qquad

\forall j\in{1,\ldots,k},

\]



where (M_1,\ldots,M_k) are the strongest established measures or explanations.



But:



\[

C(S\rightarrow T_1)

\ll

C(S\rightarrow T_2),

\]



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



\[

Z(S,T_1)\neq Z(S,T_2).

\]



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



Exact-conjunction novelty is usually weak novelty. Earlier evaluations in this project showed the problem clearly: a technically open conjunction can still receive only (2/3) for surprise when experts[...]



---



## Step 5 — State the expert prior explicitly



For every candidate, write:



> Most experts in ([specific subfield]) currently believe that _______.



Then write:



> Our claim predicts instead that _______.



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



> For every (m), there exist two learning problems that are identical under established quantities (M_1,\ldots,M_k), but whose adaptation complexities differ by at least a factor (m).



Or:



> Any algorithm restricted to information class (\mathcal I) has error at least (1/2), while one additional statistic (Z) permits exact identification.



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

[...]