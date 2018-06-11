import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Competition } from '../../../model/competition';

@Component({
  selector: 'page-league',
  templateUrl: 'league.html'
})
export class LeaguePage {

  public competition: Competition;
  public showInfo: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController) {
    this.competition = this.navParams.get('competition');
    this.showInfo = false;
  }

  ionViewDidLoad() {

  }

  showInformation() {
    this.showInfo === false ? this.showInfo = true : this.showInfo = false;
  }

  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: '¿Desea eliminar la competición?',
      message: 'La competición quedaría eliminada de forma permanente',
      buttons: [
        {
          text: 'Eliminar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

}
