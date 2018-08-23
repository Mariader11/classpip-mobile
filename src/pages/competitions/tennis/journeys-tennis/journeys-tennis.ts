import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatePipe } from '@angular/common';

import { IonicService } from '../../../../providers/ionic.service';
import { UtilsService } from '../../../../providers/utils.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompetitionService } from '../../../../providers/competition.service';
import { JourneyService } from '../../../../providers/journey.service';

import { Match } from '../../../../model/match';
import { Competition } from '../../../../model/competition';
import { Journey } from '../../../../model/journey';


@Component({
  selector: 'page-journeys-tennis',
  templateUrl: 'journeys-tennis.html'
})
export class JourneysTennisPage {

  show : boolean;
  results : boolean;
  competition: Competition;
  journeys = new Array<Journey>();
  numJourneys: number;
  dates: String[];
  datesNoMatches: any[];

  matchesJourneys: Match[][];
  matchesPrincipal: Match[][];
  matchesSecondary: Match[][];
  lastJourney: number;
  tournaments: String[][];

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
      this.show = false;
      this.results = false;
    }

  ionViewDidLoad() {
    this.ionicService.showLoading(this.translateService.instant('APP.WAIT'));
    this.getJourneys();
  }
  /**
   * This method returns the journeys of the current competition
   * and calls the getMatches method
   */
  private getJourneys(): void {
    this.journeyService.getJourneysCompetition(this.competition.id).subscribe(
      ((journeys: Array<Journey>) => {
        this.journeys = journeys;
        this.journeys.sort(function (a, b) {
          return (a.number - b.number);
        });
        this.numJourneys = this.journeys.length;
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
      this.journeyService.getMatchesJourneyDetails(this.journeys[_j].id, this.competition).subscribe(
      ((matches: Array<Match>) => {
        this.matchesJourneys[_j] = [];
        for (let _m = 0; _m < matches.length; _m++) {
          this.matchesJourneys[_j][_m] = new Match();
          this.matchesJourneys[_j][_m] = matches[_m];
        }
        if (this.matchesJourneys[_j][0].winner === 0) { this.lastJourney = _j; }
        countJourneys++;
        if ( countJourneys === this.lastJourney + 1 || countJourneys === this.numJourneys) {
          if ( this.lastJourney === undefined ) { this.lastJourney = this.numJourneys - 1; }
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
   * and the rest of content to show in the journeys-tennis page
   */
  private getDatesAndResults(): void {
    this.dates = [];
    this.datesNoMatches = [];
    this.tournaments = [];
    // DATES AND TOURNAMENTS
    for (let _j = 0; _j < this.journeys.length; _j++) {
      if ( _j <= this.lastJourney) {
      this.journeys[_j].date === null ?
        this.dates[_j] = this.translateService.instant('TOURNAMENTS.NOT_ESTABLISHED') :
        this.dates[_j] = this.datePipe.transform(this.journeys[_j].date, 'dd-MM-yyyy');
      } else {
        this.journeys[_j].date === null ?
        this.datesNoMatches.push({date: this.translateService.instant('TOURNAMENTS.NOT_ESTABLISHED'), number: _j + 1}) :
        this.datesNoMatches.push({date: this.datePipe.transform(this.journeys[_j].date, 'dd-MM-yyyy'), number: _j + 1});
        if ((_j + 1) % 2 === 0 && _j !== this.journeys.length - 1) { // si es par y no es el final participa en ambos
          this.tournaments.push([
            this.translateService.instant('TOURNAMENTS.PRINCIPAL') + ': ' +  this.translateService.instant('TOURNAMENTS.PARTICIPATES'),
            this.translateService.instant('TOURNAMENTS.SECONDARY') + ': ' +  this.translateService.instant('TOURNAMENTS.PARTICIPATES')]);
        } else if ((_j + 1) % 2 !== 0) {
          this.tournaments.push([
            this.translateService.instant('TOURNAMENTS.PRINCIPAL') + ': ' +  this.translateService.instant('TOURNAMENTS.DONT_PARTICIPATES'),
            this.translateService.instant('TOURNAMENTS.SECONDARY') + ': ' +  this.translateService.instant('TOURNAMENTS.PARTICIPATES')]);
        } else if ( _j === this.journeys.length - 1) {
          this.tournaments.push([this.translateService.instant('TOURNAMENTS.FINAL')]);
        }
      }
    }
    // TO INTRODUCE THE RESULT AND TO SEPARATE IN PRINCIPAL AND SECONDARY MATCHES
    this.matchesPrincipal = [];
    this.matchesSecondary = [];
    for (let _j = 0; _j < this.matchesJourneys.length; _j++) {
      this.matchesPrincipal[_j] = [];
      this.matchesSecondary[_j] = [];
      for (let _m = 0; _m < this.matchesJourneys[_j].length; _m++) {
        if ( this.matchesJourneys[_j][_m].winner === 0 ) {
          this.matchesJourneys[_j][_m].result = '-';
        } else {
          this.matchesJourneys[_j][_m].winner === this.matchesJourneys[_j][_m].playerOne ?
          this.matchesJourneys[_j][_m].result = this.matchesJourneys[_j][_m].namePlayerOne :
          this.matchesJourneys[_j][_m].result = this.matchesJourneys[_j][_m].namePlayerTwo;
        }
        if ((_j + 1) % 2 === 0) { // si es par participa en ambos
          _m < this.matchesJourneys[_j].length / 2 ?
          this.matchesPrincipal[_j].push(this.matchesJourneys[_j][_m]) :
          this.matchesSecondary[_j].push(this.matchesJourneys[_j][_m]);
        } else if ((_j + 1) % 2 !== 0 && _j !== 0) { // si es impar participa solo en el secundario excepto en el primer partido
          this.matchesSecondary[_j].push(this.matchesJourneys[_j][_m]);
        } else if ( _j === 0) {
          this.matchesPrincipal[_j].push(this.matchesJourneys[_j][_m]);
        }
      }
    }
    this.results = true;
    this.ionicService.removeLoading();
  }

  showMore() {
    this.show === true ? this.show = false : this.show = true;
  }
}
