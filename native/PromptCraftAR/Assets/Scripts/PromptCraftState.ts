// Owns deterministic prompt/session/example logic. No Lens, view, input or network dependencies.
export type Audience = 'unspecified' | 'young';
export const PROVENANCE = 'Prepared offline sample. Authored illustration; not live AI output.';
export interface Snapshot { audience: Audience; revision: number; prompt: string; example: string; effect: string; provenance: string }
export class PromptCraftSession {
  private audience: Audience = 'unspecified';
  private revision = 0;
  snapshot(): Snapshot {
    const young = this.audience === 'young';
    return {
      audience: this.audience, revision: this.revision,
      prompt: young ? 'Write me a story. For a young reader.' : 'Write me a story.',
      example: young ? 'Mira saw a seed. She and Jo dug a hole.\nTogether, they helped a flower grow.' : 'Mira found a seed. With Jo, she planted it.\nIn time, a flower grew.',
      effect: young ? 'Audience: young reader selected.\nEffect: short sentences and simple words.' : 'Audience: not specified.\nChoose Young reader to change the wording.',
      provenance: PROVENANCE,
    };
  }
  select(value: unknown, expectedRevision: number): boolean {
    if (expectedRevision !== this.revision || (value !== 'young' && value !== 'unspecified')) return false;
    if (value === this.audience) return false;
    this.audience = value;
    this.revision++;
    return true;
  }
  restart(): void { this.audience = 'unspecified'; this.revision++; }
}
