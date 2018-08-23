import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Competition } from '../../../model/competition';
import { TeamsPage } from '../teams/teams';
import { TournamentsPage } from './tournaments/tournaments';
import { JourneysTennisPage } from './journeys-tennis/journeys-tennis';

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
  /**
   * Method called from the tennis page
   * to open the tournaments page
   */
  private goToTournaments() {
    this.navCtrl.push(TournamentsPage, {competition: this.competition})
  }
  /**
   * Method called from the tennis page
   * to open the calendar page
   */
  private goToCalendar() {
    this.navCtrl.push(JourneysTennisPage, {competition: this.competition})
  }
  /**
   * Method called from the tennis page
   * to open the teams page
   */
  private goToTeams() {
    this.navCtrl.push(TeamsPage, {competitionId: this.competition.id})
  }
  /**
   * Method called from the tennis page to show
   * or not show the information about the competition
   */
  private showInformation() {
    this.showInfo === false ? this.showInfo = true : this.showInfo = false;
  }

}
