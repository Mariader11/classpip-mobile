import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Competition } from '../../../model/competition';

@Component({
  selector: 'page-tennis',
  templateUrl: 'tennis.html'
})
export class TennisPage {

  public competition: Competition;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.competition = this.navParams.get('competition');
    // tslint:disable-next-line:no-console
    console.log(this.competition);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TennisPage');
  }

}
