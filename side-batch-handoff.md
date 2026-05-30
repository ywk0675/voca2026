# Side Batch Handoff

## 2026-05-23

- Side thread owns generation for the `fairy` and `candy` asset lines.
- Main thread should continue all other monster or asset lines without waiting on this side batch.
- No runtime/source code changes are included in this handoff.

### Completed side assets

- `fairy`: `pinkpuff`, `floppear`, `lunabun`
- `candy`: `sweetlet`, `sugarpaw`, `candrix`
- Final PNG paths: `/monsters/{lineId}/{stageId}.png`
- Source chroma paths: `/monsters/{lineId}/_source/{stageId}-chroma.png`
- Runtime registration intentionally left for integration pass to avoid `src/monsterAssets.js` conflicts with the main thread.
