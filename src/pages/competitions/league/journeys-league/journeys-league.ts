import { Component } from '@angular/core';
import { NavController, NavParams, Refresher } from 'ionic-angular';
import { DatePipe } from '@angular/common';

import { IonicService } from '../../../../providers/ionic.service';
import { UtilsService } from '../../../../providers/utils.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompetitionService } from '../../../../providers/competition.service';
import { JourneyService } from '../../../../providers/journey.service';

import { Competition } from '../../../../model/competition';
import { Journey } from '../../../../model/journey';
import { Match } from '../../../../model/match';



@Component({
  selector: 'page-journeys-league',
  templateUrl: 'journeys-league.html'
})
export class JourneysLeaguePage {

  public competition: Competition;
  public journeys: Array<Journey>;
  public matchesJourneys: Array<Array<Match>>;

  public descanso: number;
  public dates: Array<String>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ionicService: IonicService,
    public utilsService: UtilsService,
    public translateService: TranslateService,
    public competitionService: CompetitionService,
    public journeyService: JourneyService,
    public datePipe: DatePipe) {
    this.competition = this.navParams.get('competition');
  }

  ionViewDidLoad() {
    this.ionicService.showLoading(this.translateService.instant('APP.WAIT'));
    this.getJourneys();
  }
  /**
   * This method returns the journeys of the current competition
   * and calls the getMatches method
   */
  private getJourneys(refresher?: Refresher): void {
    this.journeyService.getJourneysCompetition(this.competition.id).finally(() => {
      refresher ? refresher.complete() : null;
    }).subscribe(
      ((journeys: Array<Journey>) => {
        this.journeys = journeys;
        this.journeys.sort(function (a, b) {
          return (a.number - b.number);
        });
        this.getMatches();
      }),
      (error => {
        this.ionicService.removeLoading();
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      }));
  }
  /**
   * This method returns the matches of each journey
   * and calls the getDatesAndResults method
   */
  private getMatches(): void {
    let countJourneys = 0;
    this.matchesJourneys = [];
    for (let _j = 0; _j < this.journeys.length; _j++) {
      this.matchesJourneys[_j] = [];
      this.journeyService.getMatchesJourneyDetails(this.journeys[_j].id, this.competition).subscribe(
      ((matches: Array<Match>) => {
        countJourneys = countJourneys + 1;
        for (let _m = 0; _m < matches.length; _m++) {
          if (matches[_m].namePlayerOne === 'Ghost' || matches[_m].namePlayerTwo === 'Ghost') {
            this.descanso = _m;
          }
        }
        if (this.descanso !== undefined) {
          matches.splice(this.descanso, 1); // y ocultando el enfrentamiento del descanso
          }
        this.matchesJourneys[_j] = matches;
         if ( countJourneys === this.journeys.length ) {
           this.getDatesAndResults();
          }
      }),
      (error => {
        this.ionicService.removeLoading();
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      }));
    }
  }
  /**
   * This method make the date and results of each journey
   * to show in the journeys-league page
   */
  private getDatesAndResults(): void {
    this.dates = [];
    for (let _j = 0; _j < this.journeys.length; _j++) {
      this.journeys[_j].date === null ?
        this.dates[_j] = 'No establecida' :
        this.dates[_j] = this.datePipe.transform(this.journeys[_j].date, 'dd-MM-yyyy');
      for (let _m = 0; _m < this.matchesJourneys[_j].length; _m++) {
        if (this.matchesJourneys[_j][_m].winner === this.matchesJourneys[_j][_m].playerOne ) {
          this.matchesJourneys[_j][_m].result = this.matchesJourneys[_j][_m].namePlayerOne;
        } else if ( this.matchesJourneys[_j][_m].winner === this.matchesJourneys[_j][_m].playerTwo ) {
          this.matchesJourneys[_j][_m].result = this.matchesJourneys[_j][_m].namePlayerTwo;
        } else if ( this.matchesJourneys[_j][_m].winner === 1 ) {
          this.matchesJourneys[_j][_m].result = 'Empate';
        } else if ( this.matchesJourneys[_j][_m].winner === 0 ) {
          this.matchesJourneys[_j][_m].result = '-';
        }
      }
    }
    this.ionicService.removeLoading();
  }

}
