# PromptCraft AR — The Living Prompt Laboratory

A standalone SPECS lesson about giving AI useful direction, comparing the result with the objective, and refining the instructions. A three-part story makes the effects visible in space.

## Try the lesson

1. Open `native/PromptCraftAR/PromptCraftAR.esproj` in Lens Studio **5.23.2.26081320** and wait for import and compilation.
2. Select **SPECS 27**, **Interactive**, **Plane** in Preview.
3. Select **Begin** beneath the vague prompt. Choose an intent, audience, context and output form. The assembled instructions and authored story change together.
4. Select **Next**, predict which elements a context change affects, and compare the labeled BEFORE/NOW examples. Try again after an incorrect prediction, then Finish.

Back preserves relevant choices. Help explains the current step. Restart clears the lesson. Motion can be disabled. The standard UIKit Frame supports placement; **Recenter lab** restores the workspace in front of the camera. Three story elements occupy distinct depths, connected by arrows; numbered labels, symbols, checkmarks and change labels supplement color.

**Prepared offline examples: authored, not live AI.** No language-model service is called. Better instructions can reduce ambiguity; real AI responses may still be wrong or incomplete and must be evaluated. This lesson does not demonstrate that adding detail guarantees a better result.

## Source and development

This is a fresh SPECS Base Template project, separate from Quantum AR Explorer. The approved official `plan-lens` brief is `native/PromptCraftAR/devpost/design-brief.md`. Development used the CLAD workflow, Lens Studio MCP, SIK and UIKit. The outer directory is the single Git repository; the native directory is the Lens Studio project and agent working directory.

Project-authored state and example logic live in `PromptCraftLabState.ts`; presentation, spatial geometry, input and regression scenarios are separate scripts under `Assets/Scripts`. The bounded example engine has 81 combinations of intent, audience, context and form. A context comparison changes setting and problem while preserving the resolution for the same intent, audience and form.

The lesson explores concepts in *Developing AI Prompting Skills: A Complete Guide to Crafting Intelligent Conversations*, by Michael A. Trosen, Veristio Press. New concise instructional wording was written for this Lens. The lesson requires no book knowledge; no manuscript or private editorial assets are included. Future book, course and Authors Resort integrations are proposals only.

Required package versions are SIK **2.0.0** (runtime self-report **0.18.0**), UIKit **2.0.0**, and LEAF **2.0.2**. Keep this tested set together. Runtime-inspector tools that automatically import newer packages can introduce incompatible dependencies.

## Verify

With Node.js 24, run from `native/PromptCraftAR`:

```sh
node --test tests/*.test.mjs
```

All **28 tests pass**, including every bounded combination, context comparisons, feedback, reversal, navigation, Restart and stale input rejection.

Open the compatible LEAF panel in Lens Studio and list the registered scenarios. `promptcraft-lab` supports `full` and `discover` modes; `promptcraft-lab-guards` checks cancellation and stale releases; `promptcraft-placement` checks Frame movement and recovery. Reopen/rebind LEAF after compilation or an environment reset if its panel loses the runtime connection. A timeout without a scenario-manager run is a failed attempt, not a passing test.

The polished canonical project and an exact **59-file clean source-only payload** were independently opened, imported, compiled and exercised through genuine LEAF/SIK/UIKit input. Both passed the full lesson, guard, placement and Discover-comparison scenarios. Front, side and furnished Preview captures were inspected. Canonical was restored to Stage 1 with no held input. Local cache, settings, debug keys and MCP credentials are generated separately and must remain excluded from source control.

Preview tests do not establish ordinary Windows mouse activation, physical hand tracking, hardware comfort, contrast, performance or novice learning. No participant study or device profiling has been performed.

## Rights and release state

Veristio ownership is reserved. No permissive license for project-authored content has been granted. Snap templates, packages and their third-party dependencies retain their own terms and notices; they are not relicensed by this project.

Source release excludes private evidence, manuscript material, generated credentials and editor caches. Local validation is not a platform submission. Michael retains final branding, legal and rights attestations, YouTube upload and Devpost submission. No public demo URL is claimed here.