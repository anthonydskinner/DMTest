import { Component, AfterViewInit, Input, Injector, OnDestroy } from '@angular/core';

import { WINDOW_PROVIDERS, WINDOW } from '../../util/window.service';
import { PollForGlobalUtil } from '../../util/poll-for-global.service';

import { DynamicScriptLoaderService } from '../../services/dynamic-script-loader-service.service';
import { Subject, Subscription } from 'rxjs';

declare const s7viewers: any;

@Component({
  selector: 'app-custom-dynamic-media',
  templateUrl: './custom-dynamic-media.component.html',
  styleUrls: ['./custom-dynamic-media.component.scss']
})
export class CustomDynamicMediaComponent implements AfterViewInit, OnDestroy {

  public window: Window;
  private pollForGlobal: Subject<string>;
  private pollForGlobalSubscription: Subscription;

  private globalFnPoll: Subject<string>;
  private globalFnPollSubscription: Subscription;

  constructor(
    private pollForGlobalUtil: PollForGlobalUtil,
    private dynamicScriptLoader: DynamicScriptLoaderService
  ) {
    const injector = Injector.create({ providers: WINDOW_PROVIDERS });
    this.window = injector.get(WINDOW);
  }

  @Input() type: string;
  @Input() containerId: string;
  @Input() path: string;
  @Input() dataMode: string;

  s7params = {
    viewers: {
      globalFn: 's7viewers',
      scriptName: 'video-viewer'
    },
    image: {
      globalFn: 's7responsiveImage',
      scriptName: 'responsive-image'
    }
  };

  ngAfterViewInit() {
    this.pollForGlobal = this.pollForGlobalUtil.pollForGlobal(this.s7params[this.type].globalFn);

    console.log('this.pollForGlobal ', this.pollForGlobal );
    this.pollForGlobalSubscription = this.pollForGlobal.subscribe(value =>
      this.onPollForGlobalResponse(value)
    );
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  scriptSelector() {
    console.log(this.s7params[this.type]);
    switch (this.s7params[this.type].globalFn) {
      case 's7viewers':
        this.callS7VideoViewer();
        break;
      case 's7responsiveImage':
        this.callS7ResponsiveImage();
        break;
      default:
        break;
    }
  }

  unsubscribe() {
    if (this.pollForGlobalSubscription) {
      this.pollForGlobalSubscription.unsubscribe();
    }
    if (this.globalFnPollSubscription) {
      this.globalFnPollSubscription.unsubscribe();
    }
  }

  onPollForGlobalResponse(val: any): void {
    if (val !== 'loaded') {
      this.loadScripts();
    } else if (val === 'loaded') {
      this.scriptSelector();
      this.unsubscribe();
    }
  }

  loadScripts() {
    this.dynamicScriptLoader
      .load(this.s7params[this.type].scriptName)
      .then(() => {
        this.globalFnPoll = this.pollForGlobalUtil.pollForGlobal(this.s7params[this.type].globalFn);
        this.globalFnPollSubscription = this.globalFnPoll.subscribe(value =>
          this.scriptSelector()
        );
        // if (typeof this.window[this.s7params[this.type].globalFn] !== 'undefined') {
        //   this.scriptSelector();
        // }
      })
      .catch(error => console.log(error));
  }

  callS7VideoViewer() {
    console.log('video called');
    new s7viewers.VideoViewer({
      containerId: this.containerId,
      params: {
        asset: this.path,
        serverurl: 'http://tmobile-dev.scene7.com/is/image/',
        videoserverurl: 'http://tmobile-dev.scene7.com/is/content/'
      }
    }).init();
  }

  callS7ResponsiveImage() {
    console.log('image called');
    this.window['s7responsiveImage'](document.getElementById(this.containerId));
  }

}
