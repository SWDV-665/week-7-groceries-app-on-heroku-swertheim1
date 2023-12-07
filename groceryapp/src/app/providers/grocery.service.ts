import { Component, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class GroceriesService {

  items: any = [];

  dataChanged$: Observable<boolean>;

  private dataChangeSubject: Subject<boolean>;

  baseUrl = "http://localhost:8080";
  // static dataChanged$: any;

  constructor(public http: HttpClient) {
    console.log('Hello GroceriesService Provider');

    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }
  // RETURNS AN OBSERVABLE WITH EACH VALUE EMITTED AS AN ARRAY OF OBJECTS
  getItems(): Observable<object[]> {
    
    return this.http.get(this.baseUrl + '/api/groceries').pipe(  
      // TRANSFORMS data received from the HTTP request via extractData function
      map(this.extractData),
      catchError(err => { throw err }),
      
    );
    
  }

  private extractData(res: Response | any) {
    let body = res;
    return body || {};
  }



  addItem(item: any) {
    console.log('addItem function in grocery.service.ts.', item)
    this.http.post(this.baseUrl + '/api/groceries', item).subscribe(response => {
      this.items = response;
      this.dataChangeSubject.next(true);
    }, 
    error => {
      console.log('error in addItem function')
      console.error('Error adding item: ', error);
    });
  }

  editItem(item: any, index: number, id: any) {
    
    console.log('editItem function in grocery.service.ts.', item.name, item._id)
    this.http.put(this.baseUrl + '/api/groceries/' + id, item).subscribe(response => {
      console.log('HTTP Response: ', response);
      this.items = response;
      this.dataChangeSubject.next(true);
    }, 
    error => {
      console.log('error in editItem function')
      console.error('Error editing item: ', error);
    });
  
  }

  removeItem(item: any) {
    console.log('deleteItem function in grocery.service.ts.', item)
    console.log('ID to be deleted:', item._id)
    this.http.delete(this.baseUrl + '/api/groceries/' + item._id).subscribe(response => {
      this.items = response;
      this.dataChangeSubject.next(true);
    },
    error => {
      console.error('Error deleting item: ', error);
    });
  }




}