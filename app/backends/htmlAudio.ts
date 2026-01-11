import {
  type AudiobookBackend,
  type AudiobookBackendOptions,
  type AudiobookOutline,
  type PositionChangedCallback,
  type EndedCallback,
} from "@/backends/audiobook";
import type { Metadata } from "@/backends/backend";
import { useLogger } from "@/logging";

const { debug } = useLogger("htmlAudio");
import { getAudioElement } from "@/backends/audioSingleton";

import { parseBlob } from "music-metadata-browser";

export class HtmlAudio implements AudiobookBackend {
  private audio!: HTMLAudioElement;
  private blob!: Blob;

  private positionCb!: PositionChangedCallback;
  private endedCb!: EndedCallback;

  private onError() {
    throw this.audio.error;
  }

  private onTimeUpdate() {
    const position = this.audio.currentTime;
    this.positionCb(position);
  }

  async open(blob: Blob, type: string, options: AudiobookBackendOptions) {
    this.blob = blob;
    this.audio = getAudioElement();

    // Clean up previous src if valid
    if (this.audio.src) {
      URL.revokeObjectURL(this.audio.src);
    }

    // Reset handlers to avoid duplicates from previous sessions
    this.audio.onerror = null;
    this.audio.ontimeupdate = null;
    this.audio.onended = null;

    this.positionCb = options.positionCb;
    this.endedCb = options.endedCb;

    this.audio.src = URL.createObjectURL(blob);
    this.audio.load(); // helpful to ensure it's ready

    this.audio.onerror = () => this.onError();
    this.audio.ontimeupdate = () => this.onTimeUpdate();
    this.audio.onended = () => this.endedCb();
  }

  async close() {
    if (this.audio) {
      this.audio.pause();
      if (this.audio.src) {
        URL.revokeObjectURL(this.audio.src);
      }
      this.audio.src = "";
      this.audio.onerror = null;
      this.audio.ontimeupdate = null;
      this.audio.onended = null;
    }
  }

  async getMetadata(): Promise<Metadata> {
    try {
      const metadata = await parseBlob(this.blob);
      const common = metadata.common;

      const name = common.title || "";
      const authors = common.artists || (common.artist ? [common.artist] : []);

      let cover: Blob | null = null;
      if (common.picture && common.picture.length > 0) {
        const pic = common.picture[0];
        if (pic) {
          cover = new Blob([pic.data], { type: pic.format });
        }
      }

      return { name, authors, cover };
    } catch (e) {
      debug(`Failed to extract metadata: ${e}`);
      return { name: "", authors: [], cover: null };
    }
  }

  async getLength(): Promise<number> {
    if (!isNaN(this.audio.duration) && this.audio.duration !== Infinity) return this.audio.duration;

    debug("Unknown duration, so waiting for duration change");
    return new Promise((resolve) => {
      const onDurationChange = () => {
        this.audio.removeEventListener("durationchange", onDurationChange);
        resolve(this.audio.duration);
      };
      this.audio.addEventListener("durationchange", onDurationChange);
    });
  }

  async getOutlines(): Promise<AudiobookOutline[]> {
    try {
      const metadata = await parseBlob(this.blob);
      // music-metadata doesn't provide a strongly typed chapters implementation in all versions,
      // but commonly it's under common.chapters (as ID3v2 chapter support) if available.
      const chapters = (metadata.common as any).chapters || [];

      return chapters.map((chapter: any, index: number) => ({
        id: chapter.elementID || `chap-${index}`,
        name: chapter.title || `Chapter ${index + 1}`,
        position: chapter.startTime || 0,
        children: [],
      }));

    } catch (e) {
      debug(`Failed to extract outlines: ${e}`);
      return [];
    }
  }

  async setPosition(position: number) {
    this.audio.currentTime = position;
  }

  async play() {
    this.audio.play();
  }

  async pause() {
    this.audio.pause();
  }

  async setRate(rate: number) {
    this.audio.playbackRate = rate;
  }

  async setVolume(volume: number) {
    this.audio.volume = volume;
  }
}
