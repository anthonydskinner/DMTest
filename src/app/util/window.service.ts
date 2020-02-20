import { isPlatformBrowser } from '@angular/common';
import {
  FactoryProvider,
  Inject,
  Injectable,
  InjectionToken,
  Optional,
  PLATFORM_ID
} from '@angular/core';
// import { convertUrlToSpanish } from '@tmo/shared/util/url';

export const WINDOW = new InjectionToken<Window>('window');

const windowProvider: FactoryProvider = {
  provide: WINDOW,
  deps: [],
  useFactory: () => window
};

export const WINDOW_PROVIDERS = [windowProvider];
export const SSR_URL = new InjectionToken<Window>('SSR_URL');

@Injectable()
export class WindowUtil {
  constructor(
    @Inject(WINDOW) private readonly window: Window,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(SSR_URL) private ssrUrl: string
  ) { }

  getURL(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.window.location.href;
    } else {
      if (!this.ssrUrl) {
        throw new Error('SSR_URL was not provided');
      }
      return this.ssrUrl;
    }
  }

  loadURL(url: string | undefined, isSpanishUrl: boolean): void {
    url = this.transformUrl(url, isSpanishUrl);
    if (!url) {
      return;
    }
    this.window.location.assign(url);
  }

  getWindow(): Window {
    return this.window;
  }

  openNewWindow(
    url: string | undefined,
    isSpanishUrl: boolean,
    path?: string
  ): void {
    url = this.transformUrl(url, isSpanishUrl, path);
    if (!url) {
      return;
    }
    this.window.open(url);
  }

  private transformUrl(
    url: string | undefined,
    isSpanishUrl: boolean,
    path?: string
  ): string | undefined {
    if (!url || !isPlatformBrowser(this.platformId)) {
      return;
    }

    // if (isSpanishUrl) {
    //   url = convertUrlToSpanish(url);
    // } else if (path) {
    //   url = `${url}/${path}`;
    // }
    // return url;
  }
}
