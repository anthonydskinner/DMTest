import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ImageComponent } from './components/image/image.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';

import { DynamicScriptLoaderService } from './services/dynamic-script-loader-service.service';
import { PollForGlobalUtil } from './util/poll-for-global.service';
import { WindowUtil } from './util/window.service';
import { VideoComponent } from './components/video/video.component';
import { CustomDynamicMediaComponent } from './components/custom-dynamic-media/custom-dynamic-media.component';

@NgModule({
  declarations: [AppComponent, ImageComponent, HomeComponent, AboutComponent, VideoComponent, CustomDynamicMediaComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [DynamicScriptLoaderService, PollForGlobalUtil, WindowUtil],
  bootstrap: [AppComponent]
})
export class AppModule {}
