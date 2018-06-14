import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { IonicService } from '../../../../providers/ionic.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { CompetitionService } from '../../../../providers/competition.service';
import { JourneyService } from '../../../../providers/journey.service';

import { Competition } from '../../../../model/competition';
import { Journey } from '../../../../model/journey';
import { Match } from '../../../../model/match';
import { Team } from '../../../../model/team';
import { Student } from '../../../../model/student';

@Component({
  selector: 'page-tournaments',
  templateUrl: 'tournaments.html'
})
export class TournamentsPage {

  public final = false;
  public finished = false;
  public tournamentCompleted = false;
  public winner: string;

  public competition: Competition;
  public journeys: Array<Journey>;
  public matchesJourneys: Array<Array<Match>>;

  public lastJourney: number;
  public participants: any[];
  public participantsPrimary: String[];
  public participantsSecondary: String[];
  public participantsEliminated: String[];
  ghostIndex: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ionicService: IonicService,
    public translateService: TranslateService,
    public competitionService: CompetitionService,
    public journeyService: JourneyService) {
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
  private getJourneys(): void {
    this.journeyService.getJourneysCompetition(this.competition.id).subscribe(
      ((journeys: Array<Journey>) => {
        this.journeys = journeys;
        this.journeys.sort(function (a, b) { return (a.number - b.number); });
        this.getMatches();
      }), (error => {
        this.ionicService.removeLoading();
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      }));
  }
  /**
   * This method returns the matches of each journey
   * and calls the getParticipants method
   */
  private getMatches(): void {
    this.matchesJourneys = [];
    let journeysCompleted = 0;
    for (let _n = 0; _n < this.journeys.length; _n++) {
      this.journeyService.getMatchesJourneyDetails(this.journeys[_n].id, this.competition).subscribe(
      ((matches: Array<Match>) => {
        this.matchesJourneys[_n] = [];
        for (let _m = 0; _m < matches.length; _m++) {
          this.matchesJourneys[_n][_m] = new Match();
          this.matchesJourneys[_n][_m] = matches[_m];
        }
        journeysCompleted++;
        if (this.matchesJourneys[_n][0].winner === 0) { this.lastJourney = _n; }
        if ( journeysCompleted === this.lastJourney + 1 || this.matchesJourneys.length === this.journeys.length) {
          if ( this.lastJourney === undefined ) { this.lastJourney = this.journeys.length - 1; }
          this.getParticipants();
        }
      }), (error => {
        this.ionicService.removeLoading();
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      }));
    }
  }
  /**
   * This method returns the participants of the current competition
   * and calls the getTournamentStatus method
   */
  private getParticipants(): void {
    this.participants = [];
    if (this.competition.mode === 'Individual') {
      this.competitionService.getStudentsCompetition(this.competition.id)
      .subscribe(( (students: Array<Student>) => {
        for (let _s = 0; _s < students.length; _s++) {
          this.participants[_s] = {
            id: +students[_s].id,
            name: students[_s].name.concat(' ', students[_s].surname)
          };
        }
        this.getTournamentStatus();
      }), (error => {
        this.ionicService.removeLoading();
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      }));
      } else {
      this.competitionService.getTeamsCompetition(this.competition.id)
      .subscribe(( (teams: Array<Team>) => {
        for (let _t = 0; _t < teams.length; _t++) {
          this.participants[_t] = {
            id: +teams[_t].id,
            name: teams[_t].name
          };
        }
        this.getTournamentStatus();
      }), (error => {
        this.ionicService.removeLoading();
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      }));
      }
  }
  /**
   * This method divides the participants between the main tournament,
   *  the secondary tournament and the eliminated ones
   */
  private getTournamentStatus(): void {

   this.participantsPrimary = [];
   this.participantsSecondary = [];

    for (let _m = 0; _m < this.matchesJourneys[this.lastJourney].length; _m++) {
     if ( this.lastJourney === 0 ) {
      this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
      this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
     } else if ( (this.lastJourney + 1) % 2 === 0 && this.lastJourney + 1 !== this.journeys.length ) {
       if ( _m < this.matchesJourneys[this.lastJourney].length / 2 ) {
        this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
        this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
       } else {
        this.participantsSecondary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
        this.participantsSecondary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
       }
     } else if ( (this.lastJourney + 1) % 2 !== 0 ) {
      this.matchesJourneys[this.lastJourney - 1][_m].winner === this.matchesJourneys[this.lastJourney - 1][_m].playerOne ?
      this.participantsPrimary.push(this.matchesJourneys[this.lastJourney - 1][_m].namePlayerOne) :
      this.participantsPrimary.push(this.matchesJourneys[this.lastJourney - 1][_m].namePlayerTwo);
      this.participantsSecondary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
      this.participantsSecondary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
     } else if ( this.lastJourney + 1 === this.journeys.length ) {
      this.final = true;
      if ( this.matchesJourneys[this.lastJourney][0].winner !== 0) {
        this.tournamentCompleted = true;
        this.matchesJourneys[this.lastJourney][0].winner === this.matchesJourneys[this.lastJourney][0].playerOne ?
        this.winner = this.matchesJourneys[this.lastJourney][0].namePlayerOne :
        this.winner = this.matchesJourneys[this.lastJourney][0].namePlayerTwo;
      }
      this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
      this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
     }
    }

    // Deleting ghosts to show
    this.ghostIndex = 0;
    while ( this.ghostIndex < this.participantsPrimary.length) {
      if (this.participantsPrimary[this.ghostIndex] === 'Ghost') {
        this.participantsPrimary.splice(this.ghostIndex, 1);
        this.ghostIndex = 0;
      } else { this.ghostIndex++; }
    }
    this.ghostIndex = 0;
    while ( this.ghostIndex < this.participantsSecondary.length) {
      if (this.participantsSecondary[this.ghostIndex] === 'Ghost') {
        this.participantsSecondary.splice(this.ghostIndex, 1);
        this.ghostIndex = 0;
      } else { this.ghostIndex++; }
    }

    // Adding eliminated participants
    this.participantsEliminated = [];
    for (let _d = 0; _d < this.participants.length; _d++) {
      let count = 0;
      for (let _p = 0; _p < this.participantsPrimary.length; _p++) {
        this.participants[_d].name === this.participantsPrimary[_p] ? count = 1 : null;
      }
      count === 0 ?  this.participantsEliminated.push(this.participants[_d].name) : null;
    }

    let _q = 0;
    while (_q < this.participantsEliminated.length) {
      let count = 0;
      for (let _p = 0; _p < this.participantsSecondary.length; _p++) {
        this.participantsEliminated[_q] === this.participantsSecondary[_p] ? count = 1 : null;
      }
      if (count === 1) {
       this.participantsEliminated.splice(_q, 1);
       _q = 0;
      } else { _q++; }
    }
    this.ionicService.removeLoading();
    this.finished = true;
  }

}
