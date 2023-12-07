import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GroceriesService } from './grocery.service';
import { Grocery } from '../grocery/grocery';

@Injectable({
  providedIn: 'root'
})
export class InputDialogService {
  groceryService: any;

  constructor(
    private alertController: AlertController, 
    private dataService: GroceriesService,
    ) { }

  async showPrompt(item?: any, id?: any, index?: number) {
    console.log('showPrompt in input-dialog-service.ts')
    const alert = await this.alertController.create({
      header: item ? 'Edit the item..': 'Add an item..',
      inputs: [
        {
          placeholder: 'Name',
          name: 'name',
          value: item ? item.name: null
        },
        {
          placeholder: 'Quantity',
          name: 'quantity',
          value: item ? item.quantity: null,
          type: 'number',
          min: 1,
        },
      ],
      buttons: [
        {
          'text': 'Cancel',
          'role': 'cancel',
        },
        {
          'text': 'Save',
          'handler': (item: any) => {
            if (id !== undefined) {
              this.dataService.editItem(item, item.index, id)
            } else {
              this.dataService.addItem(item);
              console.log(`${item.name} was a added to the database`)
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
}