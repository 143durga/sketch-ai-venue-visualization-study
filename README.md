# SKETCH — Venue-Preserving AI Visualization

> **A research-oriented prototype investigating AI image editing for real-world event venue visualization while preserving the original venue's visual structure and viewpoint.**

**Status:** Prototype / Engineering Case Study
**Domain:** Generative AI · Image-to-Image Editing · Human-Centered AI · Event Technology

---

## Abstract

Event décor planning is often based on verbal descriptions, reference images, or manually prepared visualizations. For customers, this can make it difficult to understand how a proposed décor concept would look inside their actual venue.

SKETCH explores a different approach: using an uploaded photograph of a real venue as the visual starting point and generating multiple décor concepts while attempting to preserve the venue's existing visual structure and camera viewpoint.

The prototype combines a customer-facing visualization workflow with a server-side image-editing pipeline, three décor tiers, dynamic investment estimation, and proposal generation.

A key focus of this study is **venue preservation**. The system explicitly instructs the image-editing model to retain architectural elements such as walls, columns, doors, windows, ceiling, floor, room boundaries, perspective, and camera position while introducing décor elements.

The prototype also documents an important practical limitation encountered during implementation: the image-generation API available to the project did not provide usable free-tier image-generation quota. Therefore, this repository does **not** claim successful visual-generation quality or architectural fidelity from generated outputs. Instead, it documents the implemented pipeline, its constraints, and the experimental conditions required for further evaluation.

---

## 1. Problem Statement

AI image-generation systems can create visually convincing scenes, but transforming an existing real-world photograph introduces a different requirement.

For venue visualization, generating an attractive but completely different venue is not sufficient.

The desired system should:

* accept a photograph of the customer's actual venue;
* preserve the venue's existing architectural structure;
* maintain the original camera viewpoint and perspective;
* add event-specific décor;
* produce multiple styling alternatives;
* provide an estimated investment alongside the visual concepts.

This creates the following research question.

---

## 2. Research Question

> **Can an image-to-image AI workflow be designed to generate event décor concepts from a real venue photograph while maintaining the visual identity, architecture, and viewpoint of the original venue?**

A secondary engineering question is:

> **What practical API, model, and system constraints affect the implementation and evaluation of such a workflow?**

---

## 3. Proposed System

SKETCH was designed as an end-to-end venue visualization workflow:

```text
Customer Venue Photo
        │
        ▼
Venue Study
        │
        ▼
Venue Lock
        │
        ▼
Creative Direction
        │
        ▼
┌──────────────────────────────┐
│  Essential                   │
│  Signature                   │
│  Luxury                      │
└──────────────────────────────┘
        │
        ▼
AI Image-Editing Pipeline
        │
        ▼
Investment Estimation
        │
        ▼
Proposal / Quote
```

The intended output is not a newly invented venue. The target is a visualization based on the customer's supplied venue photograph.

---

## 4. Venue Preservation Strategy

The image-editing pipeline provides the model with explicit preservation constraints.

The editing instructions require the system to preserve, where possible:

* walls;
* columns and arches;
* doors and windows;
* ceiling structure;
* flooring;
* room boundaries;
* major architectural elements;
* camera position;
* perspective;
* proportions;
* sightlines.

The model is instructed to introduce décor rather than reconstruct the venue.

### Venue Lock™

SKETCH uses the term **Venue Lock™** to describe the application's workflow constraint that the visualization is based on the customer's uploaded venue photograph.

It is **not** a claim of engineering-grade dimensional measurement or structural verification.

Actual physical dimensions and site conditions would require an on-site survey.

---

## 5. Three Visualization Concepts

SKETCH separates the proposed décor direction into three levels.

### 01 — Essential

A restrained décor direction focused on:

* elegant dining settings;
* clean linens;
* low-profile floral elements;
* warm ambient lighting;
* essential styling components.

### 02 — Signature

A more layered design including:

* floral runners;
* architectural accent lighting;
* focal stage/backdrop elements;
* curated furniture;
* additional decorative detailing.

### 03 — Luxury

A high-production concept including:

* larger floral installations;
* suspended decorative elements;
* higher-finish stage architecture;
* more complex lighting treatment;
* expanded visual detailing.

These concepts represent **design specifications in the prototype**. They should not be interpreted as experimentally verified AI-generated outputs when the image-generation service is unavailable.

---

## 6. Customer Workflow

The prototype is designed around the following inputs:

* venue photograph;
* event type;
* guest count;
* event date;
* budget range;
* décor preference / creative direction.

The workflow then presents:

1. venue study;
2. venue preservation context;
3. three décor concepts;
4. estimated investment;
5. itemized pricing;
6. proposal information.

---

## 7. Image-Editing Architecture

The image-generation component is implemented on the server side.

The customer image is supplied to the Google Gemini image-editing pipeline as image input together with tier-specific editing instructions.

### Simplified architecture

```text
Browser
   │
   │ Venue Photo + Event Information
   ▼
SKETCH Application Server
   │
   │ Server-side API request
   ▼
Google Gemini Image Model
   │
   │ Edited Image
   ▼
SKETCH
   │
   ├── Concept Visualization
   ├── Before / After Comparison
   ├── Pricing
   └── Proposal
```

The API key is intended to remain server-side through an environment variable rather than being exposed in client-side code.

---

## 8. Implementation

The prototype uses:

* React-based frontend;
* TypeScript;
* Node.js server-side logic;
* Google GenAI SDK;
* Gemini image-capable models;
* server-side environment variables;
* dynamic pricing logic;
* responsive proposal interface.

The current implementation includes a dedicated image-generation endpoint and UI states for the visualization process.

---

## 9. Generation Experience

When image generation is available, the interface provides staged progress states:

```text
Studying your venue…
        ↓
Locking architectural perspective…
        ↓
Composing your décor…
        ↓
Preparing three concepts…
```

Once an edited image is returned, the concept interface supports comparison between the original venue photograph and the generated visualization.

---

## 10. Investment Estimation

SKETCH includes an investment-preview system rather than presenting a single fixed price.

The estimate can incorporate factors such as:

* guest count;
* selected concept tier;
* décor requirements;
* floral requirements;
* lighting;
* furniture;
* stage/backdrop;
* production/labor;
* selected enhancements.

The estimate is presented in INR by default with multi-currency support in the interface.

### Pricing Disclaimer

The displayed amount is an **estimate**, not a final quotation.

Final pricing can depend on:

* actual venue conditions;
* measurements;
* material selection;
* vendor availability;
* logistics;
* installation requirements;
* event-specific requirements.

A site inspection would be required for a final commercial quotation.

---

## 11. Experimental Setup

The prototype was designed to evaluate the following intended pipeline:

```text
Real Venue Photograph
        ↓
Image-to-Image Model
        ↓
Essential Visualization
Signature Visualization
Luxury Visualization
        ↓
Visual Comparison
        ↓
Human Evaluation
```

The intended evaluation criteria include:

### Architectural Preservation

Does the generated visualization retain the original:

* structure;
* walls;
* columns;
* doors/windows;
* ceiling;
* floor;
* boundaries?

### Viewpoint Preservation

Does the generated image maintain:

* camera position;
* perspective;
* framing;
* major sightlines?

### Décor Transformation

Does the output introduce the intended:

* floral arrangements;
* furniture;
* lighting;
* stage/backdrop;
* event styling?

### Visual Quality

Future evaluation could examine:

* realism;
* consistency;
* visual artifacts;
* unintended architectural changes.

---

## 12. Results

### Verified Engineering Results

| Component                         | Status      |
| --------------------------------- | ----------- |
| Venue photo upload workflow       | Implemented |
| Venue-preservation constraints    | Implemented |
| Three-tier concept system         | Implemented |
| Server-side Gemini integration    | Implemented |
| Image-generation request pipeline | Implemented |
| Generation progress states        | Implemented |
| Before/After comparison           | Implemented |
| Dynamic investment estimation     | Implemented |
| Proposal generation               | Implemented |
| API failure/quota handling        | Implemented |

### Image-Quality Evaluation

The actual generated-image evaluation was **not completed under the available API configuration**.

Therefore, this project does not report:

* architectural preservation accuracy;
* image similarity scores;
* realism scores;
* human evaluation scores;
* model-to-model performance comparisons.

No numerical results are fabricated or inferred.

---

## 13. Observed System Limitation

During implementation, the available Google image-generation API configuration reported a free-tier image-generation request limit of **0** for the relevant image-generation models.

As a result, the image-generation stage could not be executed under the available no-cost API configuration.

This creates an important distinction:

```text
Application Pipeline
        │
        ├── Implemented
        │
        ▼
Image Generation API
        │
        └── Execution constrained by available quota
```

The limitation is therefore documented as an **experimental/API constraint**, rather than treating an unavailable generation response as a successful result.

When image generation is unavailable, SKETCH:

* retains the original venue photograph;
* does not display fabricated output;
* does not use placeholder images as generated results;
* communicates the generation limitation;
* preserves the remaining concept, pricing, and proposal workflow.

---

## 14. Discussion

The prototype highlights an important distinction between designing an AI application and experimentally validating an AI system.

A complete software pipeline can be implemented even when an external model service prevents the final experimental stage from being executed.

For venue visualization, successful deployment would require evaluating more than whether an image can be generated. The generated result must also preserve the identity of the original venue while introducing the requested décor.

This makes architectural fidelity an important evaluation dimension for future experiments.

The current prototype therefore serves as an engineering foundation for controlled evaluation rather than claiming that the preservation problem has been solved.

---

## 15. Threats to Validity

Several limitations affect the conclusions that can currently be drawn.

### API Availability

The image-generation experiment depends on external model availability and quota.

### Lack of Generated Samples

Without executable image-generation responses, architectural fidelity cannot currently be measured.

### No Human Evaluation

The prototype has not yet been evaluated by professional decorators, event planners, or customers.

### No Benchmark Dataset

A controlled venue-image dataset has not yet been established.

### Prompt Dependence

The proposed preservation behavior depends partly on the instructions supplied to the image-editing model.

### Real-World Venue Variation

Different venues may contain:

* reflective surfaces;
* complex lighting;
* occlusions;
* unusual architectural structures;
* crowded environments.

These factors may affect image-editing performance.

---

## 16. Future Work

Future experimentation can extend the prototype in several directions.

### 1. Controlled Image Generation

Run the pipeline with an image-generation configuration that provides usable image-generation access.

### 2. Architectural Fidelity Evaluation

Compare original and generated images using suitable image-similarity and structural evaluation methods.

### 3. Human Evaluation

Ask participants to evaluate:

* venue preservation;
* décor realism;
* visual quality;
* concept usefulness.

### 4. Comparative Model Evaluation

Evaluate multiple image-editing models using the same venue images and equivalent prompts.

### 5. Automated Structural Checks

Investigate computer-vision methods for detecting unintended changes to architectural regions.

### 6. Prompt Robustness

Test whether preservation behavior remains consistent under different:

* venue types;
* lighting conditions;
* camera angles;
* décor styles;
* prompt formulations.

### 7. Dataset Development

Create a controlled benchmark of venue photographs and corresponding décor-editing requirements.

---

## 17. Ethical and Reliability Considerations

AI-generated venue visualizations should be treated as **design previews**, not guarantees of final physical appearance.

The system should not imply:

* exact dimensions;
* structural safety;
* engineering feasibility;
* guaranteed material availability;
* guaranteed final cost.

Physical implementation requires professional site assessment and appropriate event-production planning.

The prototype intentionally avoids presenting unsupported claims as verified measurements or engineering results.

---

## 18. What This Prototype Demonstrates

SKETCH demonstrates an end-to-end architecture for connecting:

**Real-world image input + generative AI + structured design concepts + pricing + proposal generation**

while explicitly addressing the challenge of preserving the original venue.

The project also demonstrates an important engineering principle:

> **When an external AI capability cannot be experimentally verified, the system should report the limitation rather than fabricate the result.**

---

## 19. Project Status

**Current status: Prototype / Research Engineering Case Study**

### Completed

* Customer-facing application workflow
* Venue upload
* Venue Lock concept
* Three-tier décor specification
* Server-side Gemini integration
* Image-editing request architecture
* Pricing engine
* Proposal workflow
* Failure and quota handling
* Research-oriented documentation

### Pending Experimental Work

* Executable image-generation runs under a suitable quota configuration
* Generated-image dataset
* Architectural fidelity evaluation
* Human evaluation
* Quantitative benchmarking

---

## 20. Conclusion

SKETCH explores the practical design of an AI-assisted venue visualization system in which the customer's real venue photograph serves as the foundation for proposed event décor concepts.

The prototype establishes the application architecture, preservation constraints, concept-generation workflow, pricing layer, and proposal experience.

The final image-generation experiment remains an open research stage because the available API configuration imposed an image-generation quota limitation. Rather than presenting simulated outputs or unsupported performance claims, the project records this limitation explicitly.

This makes SKETCH a foundation for future experimental work on **venue-preserving image-to-image generation, architectural fidelity, and reliable AI-assisted visualization**.

---

## Demo

**Live Prototype:**
[Add the published AI Studio URL here](https://ai.studio/apps/f484cb89-f03f-4620-8430-53dd04fe62ab?fullscreenApplet=true).

---

## Repository Structure

```text
sketch-ai-venue-visualization-study/
│
├── src/
│   ├── components/
│   ├── data/
│   └── types/
│
├── server.ts
├── package.json
├── README.md
│
└── research/
    ├── methodology.md
    ├── experimental-results.md
    └── limitations.md
```

---

## Disclaimer

SKETCH is a research-oriented software prototype.

The visualizations and investment estimates are intended for conceptual planning only. AI-generated visualizations, when available, should not be interpreted as exact representations of final physical installations, dimensions, structural conditions, material availability, or final commercial pricing.

---

## License

Add an appropriate open-source license before distributing the source code publicly.
