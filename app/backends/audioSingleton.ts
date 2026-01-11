export let audioElement: HTMLAudioElement | null = null;

export function getAudioElement(): HTMLAudioElement {
    if (!audioElement) {
        audioElement = new Audio();
    }
    return audioElement;
}
