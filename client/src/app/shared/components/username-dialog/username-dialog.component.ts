import { Component, Inject } from '@angular/core';
import { AppMaterialModule } from '../../../app.material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-username-dialog',
  imports: [FormsModule, ReactiveFormsModule, AppMaterialModule],
  templateUrl: './username-dialog.component.html',
  styleUrl: './username-dialog.component.scss'
})
export class UsernameDialogComponent {
  username = new FormControl('', [Validators.required, Validators.minLength(2)]);

  constructor(
    public dialogRef: MatDialogRef<UsernameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onSave() {
    if (this.username.value?.trim()) {
      this.dialogRef.close(this.username.value?.trim());
    }
  }
}
