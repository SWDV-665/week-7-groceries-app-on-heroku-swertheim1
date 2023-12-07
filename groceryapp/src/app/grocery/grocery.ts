import { Component } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFabButton, AlertController, ToastController, IonAvatar, IonItem, IonLabel, IonList,
  IonReorderGroup, IonItemSliding, IonItemOption, IonItemOptions, IonGrid, IonRow, IonCol, IonButton, IonToast, IonFab, IonIcon,
  IonAlert
} from '@ionic/angular/standalone';
import { NgFor, NgIf } from '@angular/common';
import { addIcons } from 'ionicons';
import { add, create, trash, share } from 'ionicons/icons';
import { GroceriesService } from '../providers/grocery.service';
import { Share, ShareOptions } from '@capacitor/share';
import { InputDialogService } from '../providers/input-dialog-service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-grocery',
  templateUrl: 'grocery.html',
  styleUrls: ['grocery.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, IonList, IonLabel, IonItem, IonReorderGroup, IonAvatar, IonItemSliding,
    IonItemOption, IonItemOptions, IonGrid, IonRow, IonCol, NgFor, NgIf, IonButton, IonToast, IonIcon, IonFab, IonFabButton, IonAlert]

})

// Grocery Items
export class Grocery {
  title = "Grocery"
  items: any = []
  errorMessage: string | undefined;


  // constructor
  constructor(
    private toastController: ToastController,
    public alertController: AlertController,
    public dataService: GroceriesService, 
    public inputDialogService: InputDialogService,) 
    
    {
    addIcons({ add, create, trash, share });
    this.dataService.getItems().subscribe((items: object[]) => {
      this.items = items;
    });
    
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    })
  }


  ngOnInit() {
    
    this.loadItems();
    console.log('Type of items:', typeof this.items);
    // this.dataService.dataChanged$.subscribe((dataChanged: boolean) => {
    //   this.loadItems();
    // });
  }

  loadItems() {
    this.dataService.getItems().pipe(
      catchError((error) => {
        console.error('Error loading data:', error);
        return []; // Return an empty array in case of an error
      })
    ).subscribe((response: any) => {
      // Check if the response is an object with a 'length' property (array-like)
      // If true, convert it to an array; otherwise, keep the response as is
      this.items = response && response.length !== undefined ? Array.from(response) : response; // Assign the array to the items variable
    });
  }

     

  removeItem(item: any) {
    console.log('Removing item from list ..', item.name);
    this.dataService.removeItem(item);
    this.presentToast(`${item.name} deleted.`)
  }


   // function to add an item
  addItem() {
    console.log('Adding item to list ..')
    this.inputDialogService.showPrompt()
    
  }

  // function to display the add Item using alert controller
  async showAddItemPrompt() {
    // console.log("showAddItemPrompt Function reached")    // for testing
    const prompt = await this.alertController.create({
      header: 'Add Item to List',
      inputs: [
        {
          name: 'name',
          placeholder: 'Enter item name',

        },
        {
          name: 'quantity',
          placeholder: 'Enter quantity',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            console.log('Cancel Clicked')
          }
        },
        {
          text: 'Save',
          handler: (item: any) => {
            console.log('Save Clicked', item)
            this.dataService.addItem(item);
          }
        }
      ]
    })
    // console.log(prompt, 'const prompt finished')    // for testing 
    await prompt.present();
  }

  // function that logs a remove-item msg to the console when clicked
  async editItem(item: any, index: number, id: any) {
    console.log("editing item - ", item.name, "index: ", index, "id: ", item._id);

    // toast is supposed to popup when the button is clicked.   
    const toast = await this.toastController.create({
      message: 'Editing item number  ' + Number(index + 1),
      position: 'bottom',
      duration: 3000
    });

    await toast.present();
    this.showEditItemPrompt(item, index, item._id);
  }

  // display message via a toast popup
  async presentToast(message: string){
    const toast = await this.toastController.create({
          message,
          duration: 3000,
          position: 'bottom'
    });
        await toast.present();
  }
    
  // function that shares-item msg to the console when clicked
  async shareItem(item: any, index: number) {
    console.log("Sharing item - ", item.name, "index: ", index);
    
    // toast is supposed to popup when the button is clicked.   
    const toast = await this.toastController.create({
      message: 'Sharing item: ' + item.name,
      duration: 3000
    });
    await toast.present();
    
    await Share.share({
      text: "Grocery Item: " + item.name  + " - Quantity: " + item.quantity,
      title: "Shared via Grocery App",
      dialogTitle: 'Share Grocery Item',
      
    })
  }

// function to display the edit item using an alert controller
  async showEditItemPrompt(item: any, index: number, id: any) {
    console.log(item, 'item number: ', index + 1, id);
    // console.log('item.name ', item, 'index ', index)      // FOR TESTING 

    const prompt = await this.alertController.create({

      header: "Edit the item..",
      inputs: [
        {
          name: 'name',
          value: item.name,
          placeholder: 'Name',
        },
        {
          name: 'quantity',
          value: item.quantity,
          placeholder: 'Quantity',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            console.log('Cancel clicked')
          }
        },
        {
          text: 'Update',
          handler: (item: any) => {
            console.log('Update clicked', item, 'Quantity', item.quantity, 'ID: ', item._id);
            this.dataService.editItem(item, index, id)
          }
        }
      ]
    })
    await prompt.present();
  }
}
