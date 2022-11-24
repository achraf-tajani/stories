import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorieSimpleComponent } from './storie-simple.component';

describe('StorieSimpleComponent', () => {
  let component: StorieSimpleComponent;
  let fixture: ComponentFixture<StorieSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorieSimpleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorieSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
