import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GroceryServiceService {

  items: any [] = []

  constructor() { 
    console.log('grocery service constructed')
  }

  getItems() {
    return this.items;
  }
  
  removeItem(index: number){
    this.items.splice(index, 1);
  }

  addItem(item: { name: string; quantity: number; }){
    this.items.push(item);
  }

  editItem(item: { name: string; quantity: number; }, index: number){
    this.items[index] = item;;
  }
}
