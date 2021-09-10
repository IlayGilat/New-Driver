/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-shadow */
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

const morningMonths = 3;
const eveningMonths = 6;
const newMonths = 24;
const now = new Date();

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  percentMor = 0;
  //today= `${now.getFullYear()}'-${now.getMonth()}-${now.getDate()}`;
  today = now.toISOString();
  Mor = 'מלווה בוקר';
  Eve = 'מלווה לילה';
  New = 'נהג חדש';
  percentEve = 0;
  percentNew = 0;
  daysMorString = '0';
  daysEveString = '0';
  daysNewString = '0';
  radiusMor = 100;
  radiusEve = 100;
  radiusNew = 100;
  daysMor: number;
  daysEve: number;
  daysNew: number;
  settings = true;
  fullTime: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DrivingTestPassDate: any = '';
  alertCtrl: any;
  dateDate = new Date();
  dateMor = new Date();
  dateEve = new Date();
  dateNew = new Date();


  constructor(public alertController: AlertController,private storage: Storage) {
  }

  async ngOnInit() {
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();
    this.DrivingTestPassDate = await this.storage.get('DrivingTestPass');

    if(this.DrivingTestPassDate){
      const x = setInterval(() => {
        const now = new Date();
        this.dateDate = new Date(this.DrivingTestPassDate);

        const morDate = new Date(this.dateDate);
        const eveDate = new Date(this.dateDate);
        const newDate = new Date(this.dateDate);
        morDate.setMonth(morDate.getMonth() + (morningMonths));
        eveDate.setMonth(eveDate.getMonth() + (eveningMonths));
        newDate.setMonth(newDate.getMonth() + (newMonths));

        const disMor = morDate.getTime() - this.dateDate.getTime();
        const disMorNow = morDate.getTime() - now.getTime();
        const disEve = eveDate.getTime() - this.dateDate.getTime();
        const disEveNow = eveDate.getTime() - now.getTime();
        const disNew = newDate.getTime() - this.dateDate.getTime();
        const disNewNow = newDate.getTime() - now.getTime();



        const daysMorStart = Math.floor( disMor / (1000 * 60 * 60* 24));
        this.daysMor =  Math.floor( disMorNow / (1000 * 60 * 60* 24));

        const daysEveStart = Math.floor( disEve / (1000 * 60 * 60* 24));
        this.daysEve =  Math.floor( disEveNow / (1000 * 60 * 60* 24));

        const daysNewStart = Math.floor( disNew / (1000 * 60 * 60* 24));
        this.daysNew =  Math.floor( disNewNow / (1000 * 60 * 60* 24));




        this.percentMor = ( ( daysMorStart - this.daysMor )/ daysMorStart  ) * 100;
        this.percentEve = ( ( daysEveStart - this.daysEve )/ daysEveStart  ) * 100;
        this.percentNew = ( ( daysNewStart - this.daysNew )/ daysNewStart  ) * 100;

        this.daysMorString = this.daysMor.toString();
        this.daysEveString = this.daysEve.toString();
        this.daysNewString = this.daysNew.toString();

        if (this.daysMor < 0){
          this.daysMorString =  'נגמר';
        }
        if (this.daysEve < 0){
          this.daysEveString =  'נגמר';
        }
        if (this.daysNew < 0){
          this.daysNewString =  'נגמר';
        }



        if(this.daysNew === 0){
          clearInterval(x);
        }
      }
    ,1000);

    }
  }



  async startTimer(){
    if(!this.DrivingTestPassDate){
    this.alertController.create({
      header: 'Alert',
      message: 'צריכים לבחור תאריך עבירת טסט',
      buttons: ['OK']
    }).then(async res => {

      await res.present();

    });
  }else{
    await this.storage.set('DrivingTestPass', this.DrivingTestPassDate);
    this.ngOnInit();

}

  }
}


