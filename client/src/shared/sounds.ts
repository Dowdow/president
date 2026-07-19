import card from "./sounds/card.mp3";
import end from "./sounds/end.mp3";
import nothing from "./sounds/nothing.mp3";
import nothing2 from "./sounds/nothing2.mp3";
import playing from "./sounds/playing.mp3";
import skip from "./sounds/skip.mp3";

const cardAudio = new Audio(card);
const endAudio = new Audio(end);
const nothingAudio = new Audio(nothing);
const nothing2Audio = new Audio(nothing2);
const playingAudio = new Audio(playing);
const skipAudio = new Audio(skip);

export function playCardAudio(): void {
  cardAudio.play();
}
export function playEndAudio(): void {
  endAudio.play();
}
export function playNothingAudio(): void {
  nothingAudio.play();
}
export function playNothing2Audio(): void {
  nothing2Audio.play();
}
export function playPlayingAudio(): void {
  playingAudio.play();
}
export function playSkipAudio(): void {
  skipAudio.play();
}
