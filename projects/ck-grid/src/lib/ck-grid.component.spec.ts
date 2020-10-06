import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkGridComponent } from './ck-grid.component';

describe('CkGridComponent', () => {
  let component: CkGridComponent;
  let fixture: ComponentFixture<CkGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CkGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CkGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
