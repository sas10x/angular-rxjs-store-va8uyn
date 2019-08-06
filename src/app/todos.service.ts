import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from './todo.model';
import {shareReplay} from 'rxjs/operators'

@Injectable({providedIn: 'root'})
export class TodosService {
  private readonly apiBaseUrl = 'https://5c6716e624e2140014f9ee66.mockapi.io/todo';

  constructor(private http: HttpClient) { }


  index() {
    return this.http.get<Todo[]>(`${this.apiBaseUrl}/todos`);
  }


  create(todo: Todo) {
    return this.http.post<Todo>(`${this.apiBaseUrl}/todos`, todo);
  }


  remove(id) {
    return this.http.delete(`${this.apiBaseUrl}/todos/${id}`);
  }

  setCompleted(id: string, isCompleted: boolean) {
    return this.http.put<Todo>(`${this.apiBaseUrl}/todos/${id}`, {isCompleted});

  }

}