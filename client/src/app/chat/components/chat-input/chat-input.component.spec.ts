import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInputComponent } from './chat-input.component';

describe('ChatInputComponent', () => {
  let component: ChatInputComponent;
  let fixture: ComponentFixture<ChatInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatInputComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit message when sendMessage is called with non-empty value', () => {
    spyOn(component.send, 'emit');

    component.messageControl.setValue('Hello');
    component.sendMessage();

    expect(component.send.emit).toHaveBeenCalledWith('Hello');
    expect(component.messageControl.value).toBeNull();
  });

  it('should not emit message when sendMessage is called with empty value', () => {
    spyOn(component.send, 'emit');

    component.messageControl.setValue('   ');
    component.sendMessage();

    expect(component.send.emit).not.toHaveBeenCalled();
  });
});
