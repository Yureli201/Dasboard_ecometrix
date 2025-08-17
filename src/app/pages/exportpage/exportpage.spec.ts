import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Exportpage } from './exportpage';

describe('Exportpage', () => {
  let component: Exportpage;
  let fixture: ComponentFixture<Exportpage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Exportpage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Exportpage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
