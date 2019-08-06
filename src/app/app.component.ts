import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import {TodosStoreService} from './todos-store.service'
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent  {

  @ViewChild('todoTitleInput') todoTitleInput: ElementRef;

  // optimization, rerenders only todos that change instead of the entire list of todos
  todosTrackFn = (i, todo) => todo.id;


  constructor(public todosStore: TodosStoreService) {}

  onAddTodo(title: string){
    this.todosStore.addTodo(title); 
    this.todoTitleInput.nativeElement.value = '';
  }
}
