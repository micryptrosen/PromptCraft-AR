---
status: approved
---

# Design brief: PromptCraft AR — The Living Prompt Laboratory

## The one spatial moment
The learner starts with “Write me a story.” Changing a meaningful requirement reshapes a small spatial story beside the prompt; a labeled highlight connects the changed instruction to its visible consequence. The signature discovery takes 15–20 seconds: supply direction, change one requirement, then compare the result against the goal.

## Why it belongs on glasses
- Uses: draws in the world; leaves your body free to look around a shared creative workspace.
- Why it is better than the phone or laptop version: requirements connect to story elements occupying distinct positions and depths. The learner can inspect those relationships while keeping the experiment in view. This advantage is a design hypothesis to evaluate in preview, not a proven hardware benefit.
- Target learner: a beginner practicing AI instructions, with no book knowledge required (default audience wording).
- Learning objective: recognize that intent, context and constraints reduce ambiguity, then evaluate and refine the result. More detail does not guarantee correctness or quality.
- Possible educational companion to Developing AI Prompting Skills; the lesson stands alone. Veristio Press is exploring immersive practice of concepts taught in its books. This is an educational experiment, not a book advertisement.

## Product or overlay
- Type: product; the virtual laboratory is the experience.
- What the real version would sense: nothing about physical objects or surfaces; only supported user input and placement tracking.
- Stand-in for the preview: openly labeled offline, authored examples with deterministic transitions. No live model or simulated claim of model generation. No physical recognition needs to be faked.

## Where things live
- Where the user is looking during the main task: forward and slightly down at a compact world-anchored laboratory, manually positioned and recoverable with Recenter.
- Workspace: 60 cm wide by 40 cm high by 20 cm deep, centered 110 cm ahead and 15 cm below eye level (default). Avoid real furniture; no physical table or room scan is required.
- Prompt and active requirement controls: upper and lower bands of that workspace; prompt card 54 by 12 cm, with at most three active targets, each at least 9 by 6 cm and separated by 2 cm (default).
- Story: three small connected nodes, each about 10 cm across, inside the middle band with 6 cm depth separation (default). Connections communicate relationships rather than decoration.
- Feedback and before/after comparison: replace the active story view within the same workspace when requested, rather than adding a second wall of text (default). Test legibility and adjust before detail work.

## Hands and input
- Begin, Next, Back, Help, Evaluate, Restart and Recenter: large SIK/UIKit pinch buttons, usable by mouse in Interactive Preview. Only controls relevant to the current step appear.
- Requirement selection: pinch a labeled option; selected text and a check mark confirm activation. Hover alone never counts as selection.
- Manual placement: a standard grab handle moves the whole workspace; Recenter returns it to the proposed forward position (default interaction detail).
- Targets are big and highlight when aimed at.
- Voice (if any) and the button that does the same job: none required. No custom gestures, keyboard entry or handheld controller needed in the lesson.
- Ignore repeated activation during a transition, reject stale selections, cancel without committing on interrupted input, and preserve coherent state when returning to the lesson.
- Accessibility: concise light text, generous spacing, labels and shape cues beyond color, low arm posture, no timed answers, and motion-off if animations are used. Help repeats the current action. Exact typography is a build default subject to preview checks.

## When things show
- Stage 1 — The vague prompt: first show “Write me a story.” and a sparse authored example, its disclosure, and one obvious Begin action.
- Stage 2 — Build a better prompt: reveal intent/purpose and audience, then context and constraints. Update the complete prompt and corresponding story on every choice. Briefly label the changed node; retain the selection label after any animation.
- Stage 3 — Test and refine: preserve a before snapshot, ask the learner to predict the consequence of changing one requirement, then reveal the new authored example and compare it with the selected goal. Explain the comparison and allow another attempt before a completion state.
- Proposed example set (default): intent “show cooperation”; audience “young reader” or “adult reader”; context “garden” or “space station”; form “three short story beats.” Audience changes wording, context changes setting and props, intent changes the conflict/resolution, and form constrains the displayed structure. Keep choices bounded; every exposed option must have a distinct authored effect.
- Proposed original teaching copy (default): “A clearer request gives direction. Check whether the result fits.” Evaluation prompt: “Which changed element matches your new requirement?” Feedback names the requirement and corresponding story evidence, including any authored mismatch used for refinement.
- Completion summarizes what changed and why evaluation still matters. Restart clears choices, snapshots, challenge response and feedback, restoring Stage 1. Back preserves valid choices (default navigation detail).
- If something needs attention out of view: a small labeled direction arrow to the workspace plus always recoverable Recenter (default). No essential information depends on sound.

## Done criteria
Each one can be checked in Lens Studio's preview.
1. Native vertical slice first: use one actual supported selection to change the visible prompt and its corresponding authored story element, then Restart to the initial state. Verify selection rather than hover. Do not expand into the full lesson until this passes.
2. Complete all three stages through visible controls. Each exposed requirement changes both assembled instructions and the intended story feature; reversing a choice restores the corresponding result. An observed 15–20-second signature sequence visibly demonstrates cause and effect without prerecorded interaction.
3. In Test and refine, choose a prediction, change one requirement, inspect before/after, and receive feedback tied to that requirement. A wrong prediction permits retry; completion follows the evaluation. The authored-example disclosure remains clear throughout.
4. Exercise Back, Help, Restart, Recenter, placement, repeated input, canceled input and stale selections through native routes. State stays coherent; Restart restores Stage 1. Walk around and verify readable text, reachable controls, spatial relationships and recovery from an off-view workspace. Verify motion-off and non-color cues where applicable.
5. Capture a genuine end-to-end preview demonstration under three minutes, showing the initial problem, actual interaction, changing instructions/story, evaluation and Restart with honest authored-example disclosure. After implementation, report actual LEAF coverage and outcomes plus clean reconstruction evidence; no result is claimed by this draft.

## Out of scope
- Live AI, network services, physical surface recognition, room scanning, custom or two-hand gestures, cross-session memory, multiplayer and recording or identifying bystanders.
- Open-ended writing editor, additional lessons, book QR integration and ecosystem integrations. An alternate domain example is optional future work, not required for the complete story lesson.
- Product implementation in this planning task. No build starts before Michael approves this brief; a fresh build context must prove the native vertical slice before full implementation.
- No inferred open-source license, rights waiver or publication permission.

## Risks and open questions
- Hardware feel unproven: comfort over time, real hand tracking, latency and additive-display readability need actual glasses.
- Native interaction and the learning loop are unproven; bootstrap compile/preview success does not demonstrate either.
- Learning efficacy is unproven. Preview can check whether the prediction and feedback operate and match examples; it cannot establish retained skill or transfer to real AI use.
- Defaults above are proposals for review, not owner answers. No consequential unanswered decision blocks this draft; approval remains pending.
- Spatial density and text size require preview iteration. Keep only the active step in view and adjust proposed dimensions if reading or reach fails.

## Owner control and release gates
Michael alone uploads and submits, and approves branding, entrant identity, legal and rights attestations. The generic Submit paragraph below is guidance for Michael, not agent authority. Keep media local until his review. Public-source release requires the required audit and owner gates; no repository creation, commit, upload, external message or publication is authorized by this draft.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources

