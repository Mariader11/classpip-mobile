import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Competition } from '../../../model/competition';
import { TeamsPage } from '../teams/teams';
import { ClassificationPage } from './classification/classification';
import { JourneysLeaguePage } from './journeys-league/journeys-league';

@Component({
  selector: 'page-league',
  templateUrl: 'league.html'
})
export class LeaguePage {

  public competition: Competition;
  public showInfo: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams) {
    this.competition = this.navParams.get('competition');
    this.showInfo = false;
  }

  ionViewDidLoad() {
  }
  /**
   * Method called from the league page
   * to open the classification page
   */
  private gotoClassification() {
    this.navCtrl.push(ClassificationPage, {competition: this.competition})
  }
  /**
   * Method called from the league page
   * to open the calendary page
   */
  private gotoCalendary() {
    this.navCtrl.push(JourneysLeaguePage, {competition: this.competition})
  }
  /**
   * Method called from the league page
   * to open the teams page
   */
  private goToTeams() {
    this.navCtrl.push(TeamsPage, {competitionId: this.competition.id})
  }
  /**
   * Method called from the league page to show
   * or not show the information about the competition
   */
  private showInformation() {
    this.showInfo === false ? this.showInfo = true : this.showInfo = false;
  }

}
