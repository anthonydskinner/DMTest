import { Injectable, Injector, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { WINDOW_PROVIDERS, WINDOW } from './window.service';``

@Injectable()
export class PollForGlobalUtil implements OnDestroy {
  private subject: Subject<string>;
  public window: Window;

  //intervalID is type any because NodeJS.setInterval returns Timer class
  //browser window returns a number
  public intervalID: any;

  constructor() {
    const INJECTOR = Injector.create({ providers: WINDOW_PROVIDERS });
    this.window = INJECTOR.get(WINDOW);

    this.subject = new Subject();
  }

  ngOnDestroy() {
    if (this.intervalID) {
      this.intervalID = clearInterval(this.intervalID);
    }
  }

  pollForGlobal(
    global: string,
    interval: number = 100,
    timeout: number = 1000
  ): Subject<string> {
    let counter = 0;
    interval = 100;
    this.intervalID = setInterval(() => {
      if (this.window[global]) {
        this.subject.next('loaded');
        this.intervalID = clearInterval(this.intervalID);
      } else {
        counter += interval;
        if (timeout >= counter) {
          this.subject.next('timed out');
          this.intervalID = clearInterval(this.intervalID);
        }
      }
    }, interval);

    return this.subject;
  }
}
