import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperComponent } from './swiper.component';
import { SwiperDirective } from './swiper.directive';
 

export { SwiperComponent } from './swiper.component';
export { SwiperDirective } from './swiper.directive';
export { SwiperOptions as SwiperConfigInterface } from 'swiper';

export {
  SWIPER_CONFIG,

  SwiperConfig,
  SwiperBreakpointsInterface,

  SwiperA11YInterface,
  SwiperLazyInterface,
  SwiperZoomInterface,
  SwiperHistoryInterface,
  SwiperVirtualInterface,
  SwiperAutoplayInterface,
  SwiperKeyboardInterface,
  SwiperScrollbarInterface,
  SwiperMousewheelInterface,
  SwiperControllerInterface,
  SwiperNavigationInterface,
  SwiperPaginationInterface,
  SwiperHashNavigationInterface,

  SwiperFadeEffectInterface,
  SwiperFlipEffectInterface,
  SwiperCubeEffectInterface,
  SwiperCoverflowEffectInterface,

  SwiperRenderSlideFunction,
  SwiperRenderCustomFunction,
  SwiperRenderBulletFunction,
  SwiperRenderExternalFunction,
  SwiperRenderFractionFunction,
  SwiperRenderProgressbarFunction
} from './swiper.interfaces';




@NgModule({
  declarations: [
    SwiperComponent,
    SwiperDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SwiperComponent, 
    SwiperDirective 
  ]
})
export class SwiperModule { }
