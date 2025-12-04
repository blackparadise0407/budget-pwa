import { NgOptimizedImage, SlicePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  imports: [NgOptimizedImage, SlicePipe],
  templateUrl: './avatar.component.html',
})
export class AvatarComponent {
  @Input() public url: string | null;
  @Input() public displayName: string | null;
}
