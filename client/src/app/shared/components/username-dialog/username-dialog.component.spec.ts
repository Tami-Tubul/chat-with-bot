import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsernameDialogComponent } from './username-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('UsernameDialogComponent', () => {
  let component: UsernameDialogComponent;
  let fixture: ComponentFixture<UsernameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsernameDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UsernameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog with username when valid', () => {
    component.username.setValue('Tami');
    component.onSave();
    expect(component.dialogRef.close).toHaveBeenCalledWith('Tami');
  });

  it('should not close dialog when username is empty', () => {
    component.username.setValue('');
    component.onSave();
    expect(component.dialogRef.close).not.toHaveBeenCalled();
  });
});
