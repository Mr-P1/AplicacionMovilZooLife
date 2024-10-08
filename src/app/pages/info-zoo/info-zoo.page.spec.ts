import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoZooPage } from './info-zoo.page';

describe('InfoZooPage', () => {
  let component: InfoZooPage;
  let fixture: ComponentFixture<InfoZooPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoZooPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
