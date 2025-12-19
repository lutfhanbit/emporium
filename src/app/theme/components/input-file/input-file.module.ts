import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropZoneDirective } from './directives/drop-zone/drop-zone.directive';
import { InputFileComponent } from './components/input-file/input-file.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputFileService } from './services/input-file.service';
import { InputFileConfig } from './interfaces/input-file-config';

export { InputFileConfig } from './interfaces/input-file-config';
 
@NgModule({
  declarations: [
    DropZoneDirective,
    InputFileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports : [
    InputFileComponent
  ],
  providers: [
    InputFileService
  ]
})

export class InputFileModule {
  public static forRoot(config: InputFileConfig): ModuleWithProviders<InputFileModule> {
    return {
      ngModule: InputFileModule,
      providers: [
        InputFileService,
        { provide: 'config', useValue: config }
      ]
    };
  }
}
