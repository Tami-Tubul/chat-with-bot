import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);

    // clear localStorage before each test
    localStorage.clear();
  });

  it('should save and get user name', () => {
    const name = 'Tami';
    service.setUserName(name);

    expect(localStorage.getItem('chatUserName')).toBe(name);
    expect(service.getUserName()).toBe(name);
  });

  it('should save and get user ID', () => {
    const id = '123';
    service.setUserId(id);

    expect(localStorage.getItem('chatUserId')).toBe(id);
    expect(service.getUserId()).toBe(id);
  });

  it('should return null when user name is not set', () => {
    expect(service.getUserName()).toBeNull();
  });

  it('should return null when user ID is not set', () => {
    expect(service.getUserId()).toBeNull();
  });
});
