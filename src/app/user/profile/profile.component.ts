import { Component, inject } from '@angular/core';

import { AvatarComponent } from '@/shared/components';
import { AuthService } from '@/shared/services';

@Component({
  selector: 'app-profile',
  imports: [AvatarComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);

  public user = this.authService.user;
}
