import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'
import {shareReplay, map} from 'rxjs/operators'
import { uuid } from './uuid';
import { Todo } from './todo.model';
import {TodosService} from './todos.service';

@Injectable({providedIn: 'root'})
export class TodosStoreService {


  constructor(private todosService: TodosService) {
    this.fetchAll()
  }

  // - We set the initial state in BehaviorSubject's constructor
  // - Nobody outside the Store should have access to the BehaviorSubject 
  //   because it has the write rights
  // - Writing to state should be handled by specialized Store methods (ex: addTodo, removeTodo, etc)
  // - Create one BehaviorSubject per store entity, for example if you have TodoGroups
  //   create a new BehaviorSubject for it, as well as the observable$, and getters/setters
  private readonly _todos = new BehaviorSubject<Todo[]>([]);

  // Expose the observable$ part of the _todos subject (read only stream)
  readonly todos$ = this._todos.asObservable();


  // we'll compose the todos$ observable with map operator to create a stream of only completed todos
  readonly completedTodos$ = this.todos$.pipe(
    map(todos => this.todos.filter(todo => todo.isCompleted))
  )

  readonly uncompletedTodos$ = this.todos$.pipe(
    map(todos => this.todos.filter(todo => !todo.isCompleted))
  )

  // the getter will return the last value emitted in _todos subject
  get todos(): Todo[] {
    return this._todos.getValue();
  }


  // assigning a value to this.todos will push it onto the observable 
  // and down to all of its subsribers (ex: this.todos = [])
  set todos(val: Todo[]) {
    this._todos.next(val);
  }

  async addTodo(title: string) {

    if(title && title.length) {

      // This is called an optimistic update
      // updating the record locally before actually getting a response from the server
      // this way, the interface seems blazing fast to the enduser
      // and we just assume that the server will return success responses anyway most of the time.
      // if server returns an error, we just revert back the changes in the catch statement 

      const tmpId = uuid();
      const tmpTodo = {id: tmpId, title, isCompleted: false};

      this.todos = [
        ...this.todos, 
        tmpTodo
      ];

      try {
        const todo = await this.todosService
          .create({title, isCompleted: false})
          .toPromise();

        // we swap the local tmp record with the record from the server (id must be updated)
        const index = this.todos.indexOf(this.todos.find(t => t.id === tmpId));
        this.todos[index] = {
          ...todo
        }
        this.todos = [...this.todos];
      } catch (e) {
        // is server sends back an error, we revert the changes
        console.error(e);
        this.removeTodo(tmpId, false);
      }
      
    }

  }

  async removeTodo(id: string, serverRemove = true) {
    // optimistic update
    const todo = this.todos.find(t => t.id === id);
    this.todos = this.todos.filter(todo => todo.id !== id);

    if(serverRemove) {
      try {
        await this.todosService.remove(id).toPromise();
      } catch (e) {
        console.error(e);
        this.todos = [...this.todos, todo];
      }

    }

  }

  async setCompleted(id: string, isCompleted: boolean) {
    let todo = this.todos.find(todo => todo.id === id);

    if(todo) {
      // optimistic update
      const index = this.todos.indexOf(todo);

      this.todos[index] = {
        ...todo,
        isCompleted
      }

      this.todos = [...this.todos];

      try {
        await this.todosService
          .setCompleted(id, isCompleted)
          .toPromise();

      } catch (e) {

        console.error(e);
        this.todos[index] = {
          ...todo,
          isCompleted: !isCompleted
        }
      }
    }
  }


  async fetchAll() {
    this.todos = await this.todosService.index().toPromise();
  }

}