import { Component, AfterViewInit, Input, Injector, OnDestroy } from '@angular/core';
import { WINDOW_PROVIDERS, WINDOW } from '../../util/window.service';
import { PollForGlobalUtil } from '../../util/poll-for-global.service';

import { DynamicScriptLoaderService } from '../../services/dynamic-script-loader-service.service';
import { Subject, Subscription } from 'rxjs';

declare const s7viewers: any;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements AfterViewInit, OnDestroy {

  public window: Window;
  private pollForGlobal: Subject<string>;
  private pollForGlobalSubscription: Subscription;

  constructor(
    private pollForGlobalUtil: PollForGlobalUtil,
    private dynamicScriptLoader: DynamicScriptLoaderService
  ) {
    const injector = Injector.create({ providers: WINDOW_PROVIDERS });
    this.window = injector.get(WINDOW);
  }

  @Input() path: string;
  @Input() containerId: string;

  ngAfterViewInit() {
    this.pollForGlobal = this.pollForGlobalUtil.pollForGlobal('s7viewers');
    this.pollForGlobalSubscription = this.pollForGlobal.subscribe(value =>
      this.onPollForGlobalResponse(value)
    );
  }

  ngOnDestroy() {
    this.pollForGlobalSubscription.unsubscribe();
  }

  onPollForGlobalResponse(val: any): void {
    if (val !== 'loaded') {
      this.loadScripts();
    } else if (val === 'loaded') {
      this.callS7VideoViewer();
    }
  }

  loadScripts() {
    this.dynamicScriptLoader
      .load('video-viewer')
      .then(() => {
        if (typeof this.window['s7viewers'] !== 'undefined') {
          this.callS7VideoViewer();
        }
      })
      .catch(error => console.log(error));
  }

  callS7VideoViewer() {
    console.log('called');
    new s7viewers.VideoViewer({
      containerId: this.containerId,
      params: {
        asset: this.path,
        serverurl: 'http://tmobile-dev.scene7.com/is/image/',
        videoserverurl: 'http://tmobile-dev.scene7.com/is/content/'
      }
    }).init();
    this.pollForGlobalSubscription.unsubscribe();
  }
}
