import { Component, AfterViewInit, Input, Injector, OnDestroy } from '@angular/core';

import { WINDOW_PROVIDERS, WINDOW } from '../../util/window.service';
import { PollForGlobalUtil } from '../../util/poll-for-global.service';

import { DynamicScriptLoaderService } from '../../services/dynamic-script-loader-service.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})

export class ImageComponent implements AfterViewInit, OnDestroy {

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
  @Input() imgId: string;
  @Input() dataMode: string;

  ngAfterViewInit() {
    this.pollForGlobal = this.pollForGlobalUtil.pollForGlobal('s7responsiveImage');
    this.pollForGlobalSubscription = this.pollForGlobal.subscribe(value =>
      this.onPollForGlobalResponse(value)
    );
  }

  ngOnDestroy() {
    this.pollForGlobalSubscription.unsubscribe();
  }

  onPollForGlobalResponse(val: any): void {
    if (val !== 'loaded') {
      // console.log('isnt loaded', this.imgId);
      this.loadScripts();
    } else if (val === 'loaded') {
      this.callS7ResponsiveImage();
      this.pollForGlobalSubscription.unsubscribe();
    }
  }

  loadScripts() {
    this.dynamicScriptLoader
      .load('responsive-image')
      .then(data => {
        if (typeof this.window['s7responsiveImage'] === 'function') {
          this.callS7ResponsiveImage();
        }
      })
      .catch(error => console.log(error));
  }

  callS7ResponsiveImage() {
    this.window['s7responsiveImage'](document.getElementById(this.imgId));
  }
}
