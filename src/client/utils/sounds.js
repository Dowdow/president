import card from '../sounds/card.mp3';
import end from '../sounds/end.mp3';
import nothing from '../sounds/nothing.mp3';
import nothing2 from '../sounds/nothing2.mp3';
import playing from '../sounds/playing.mp3';
import skip from '../sounds/skip.mp3';

export const cardAudio = new Audio(card);
export const endAudio = new Audio(end);
export const nothingAudio = new Audio(nothing);
export const nothing2Audio = new Audio(nothing2);
export const playingAudio = new Audio(playing);
export const skipAudio = new Audio(skip);

export function playCardAudio() {
	cardAudio.play();
}
export function playEndAudio() {
	endAudio.play();
}
export function playNothingAudio() {
	nothingAudio.play();
}
export function playNothing2Audio() {
	nothing2Audio.play();
}
export function playPlayingAudio() {
	playingAudio.play();
}
export function playSkipAudio() {
	skipAudio.play();
}