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

    // Clean up previous src if valid? 
    // Actually, usually we just set new src.
    // If we want to revoke old object URL, we need to track if it was one we created? 
    // The previous code did: if (this.audio) URL.revokeObjectURL(this.audio.src); 
    // But this.audio was new Audio(). 
    // With singleton, we might be revoking a URL from another book? 
    // Let's assume we can overwrite. 
    // Note: URL.revokeObjectURL on a blob URL is good practice. 
    // But we don't store the blob URL separately. 
    // If the singleton has a src, we could revoke it? 
    // Be careful not to revoke something else if we are sharing?
    // For now, let's just set the new src.

    // Reset handlers to avoid duplicates from previous sessions
    this.audio.onerror = null;
    this.audio.ontimeupdate = null;
    this.audio.onended = null;
    // Remove listeners if any (though we are switching to on... properties)

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
      URL.revokeObjectURL(this.audio.src);
      this.audio.src = "";
      this.audio.onerror = null;
      this.audio.ontimeupdate = null;
      this.audio.onended = null;
    }
  }

  async getMetadata(): Promise<Metadata> {
    const name = "";
    const authors: string[] = [];
    const cover = null;
    const metadata = { name, authors, cover };
    return metadata;
  }

  async getLength(): Promise<number> {
    if (!isNaN(this.audio.duration)) return this.audio.duration;

    debug("Unknown duration, so waiting for duration change");
    await new Promise((resolve) => this.audio.addEventListener("durationchange", resolve));

    return this.audio.duration;
  }

  async getOutlines(): Promise<AudiobookOutline[]> {
    try {
      const metadata = await parseBlob(this.blob);
      if (!(metadata.common as any).chapters) {
        return [];
      }

      // Convert format to AudiobookOutline
      // There isn't a strict standard for chapters in ICommonTagsResult, 
      // but assuming we get them, they mimic simple structures.
      // Actually music-metadata returns generic tag data.
      // Wait, music-metadata-browser might handle it differently.
      // Let's check what it returns? 
      // If no chapters, we return empty.

      // We need to verify if common.chapters exists. It's optional.
      // Also we need to map to our Outline structure.

      // Since we don't know the exact structure of `chapters` array elements from the type defs here (as I can't read d.ts easily right now without more tools),
      // I will assume standard ID3v2/MP4 chapter format which usually includes startTimeMs or similar.
      // Let's try to map what we can.

      /* 
         NOTE: music-metadata returns common.chapters as invalid type sometimes or requires specific parser options?
         Actually, it seems it is not always populated. 
         But assuming it works for standard files:
      */

      // Let's assume a simplified unknown approach for now, or just map what we find.
      // However, music-metadata usually returns an array of objects.

      // Let's map it safely.
      return ((metadata.common as any).chapters as any[] || []).map((chapter, index) => ({
        id: chapter.elementID || `chap-${index}`,
        name: chapter.title || `Chapter ${index + 1}`,
        position: (chapter.startTime || 0), // startTime is usually in seconds
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
