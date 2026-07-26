// Pure layout math for fanning a hand of cards out along the X axis, centered
// on x=0. Kept separate from the 3D components so it can be unit tested
// without a WebGL context.

export function handCardX(index: number, total: number, cardSpacing: number): number {
  const offsetFromCenter = index - (total - 1) / 2;
  return offsetFromCenter * cardSpacing;
}
