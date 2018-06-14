import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Competition } from '../../../model/competition';
import { TeamsPage } from '../teams/teams';
import { TournamentsPage } from './tournaments/tournaments';

@Component({
  selector: 'page-tennis',
  templateUrl: 'tennis.html'
})
export class TennisPage {

  public competition: Competition;
  public showInfo: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.competition = this.navParams.get('competition');
    this.showInfo = false;
  }

  ionViewDidLoad() {
  }

  showInformation() {
    this.showInfo === false ? this.showInfo = true : this.showInfo = false;
  }

  goToTournaments() {
    this.navCtrl.push(TournamentsPage, {competition: this.competition})
  }

  goToTeams() {
    this.navCtrl.push(TeamsPage, {competitionId: this.competition.id})
  }

}
