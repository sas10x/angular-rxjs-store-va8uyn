import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component';

import { TodoComponent } from './todo/todo.component';
import { TodosService } from './todos.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule],
  declarations: [ AppComponent, TodoComponent ],
  bootstrap:    [ AppComponent ],
  providers: [TodosService]
})
export class AppModule { }
