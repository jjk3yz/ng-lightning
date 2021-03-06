import {it, describe, expect, inject, async}  from '@angular/core/testing';
import {TestComponentBuilder, ComponentFixture} from '@angular/compiler/testing';
import {Component} from '@angular/core';
import {NglDropdown} from './dropdown';
import {NglDropdownTrigger} from './dropdown-trigger';
import {NglPick} from '../pick/pick';
import {dispatchKeyEvent} from '../../test/helpers';
import {By} from '@angular/platform-browser';

function getDropdownTrigger(fixtureElement: HTMLElement): HTMLElement {
  return <HTMLElement>fixtureElement.childNodes[0].childNodes[0];
}

describe('`nglDropdownTrigger`', () => {

  it('should have the attribute `aria-haspopup` set to `true`', testAsync((fixture: ComponentFixture<TestComponent>) => {
    const dropdownTrigger = getDropdownTrigger(fixture.nativeElement);
    fixture.detectChanges();
    expect(dropdownTrigger.getAttribute('aria-haspopup')).toBe('true');
  }));

  it('should toggle the dropdown when it is clicked', testAsync((fixture: ComponentFixture<TestComponent>) => {
    const dropdownTrigger = getDropdownTrigger(fixture.nativeElement);
    fixture.detectChanges();

    spyOn(fixture.componentInstance, 'setOpen');

    dropdownTrigger.click();
    expect(fixture.componentInstance.setOpen).toHaveBeenCalledWith(true);

    fixture.componentInstance.open = true;
    fixture.detectChanges();

    dropdownTrigger.click();
    expect(fixture.componentInstance.setOpen).toHaveBeenCalledWith(false);
  }));

  it('should open the dropdown when the down arrow key is pressed while it is focused', testAsync((fixture: ComponentFixture<TestComponent>) => {
    fixture.detectChanges();

    spyOn(fixture.componentInstance, 'setOpen').and.callFake((isOpen: boolean) => {
      expect(isOpen).toBe(true);
    });

    dispatchKeyEvent(fixture, By.directive(NglDropdownTrigger), 'keydown.ArrowDown');
    fixture.detectChanges();
  }));

  it('should have the `slds-picklist__label` class when belonging to a picklist', testAsync((fixture: ComponentFixture<TestComponent>) => {
    const dropdownTrigger = getDropdownTrigger(fixture.nativeElement);
    fixture.detectChanges();
    expect(dropdownTrigger).toHaveCssClass('slds-picklist__label');
  }, '<div nglDropdown nglPick><button type="button" nglDropdownTrigger></button></div>'));
});

// Shortcut function for less boilerplate on each `it`
function testAsync(fn: (value: ComponentFixture<TestComponent>) => void, html: string = null) {
  return async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    if (html) {
      tcb = tcb.overrideTemplate(TestComponent, html);
    }
    return tcb.createAsync(TestComponent).then(fn);
  }));
}

@Component({
  directives: [NglDropdown, NglDropdownTrigger, NglPick],
  template: ['<div nglDropdown [open]="open" (openChange)="setOpen($event)">',
    '<button type="button" nglDropdownTrigger></button>',
    '</div>',
  ].join(''),
})
export class TestComponent {
  open: boolean = false;
  setOpen(open: boolean) {
    this.open = open;
  }
}
