import { Component } from '@angular/core';
import { NavController, NavParams, Refresher } from 'ionic-angular';

import { JourneyService } from '../../../../providers/journey.service';
import { CompetitionService } from '../../../../providers/competition.service';
import { IonicService } from '../../../../providers/ionic.service';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { Competition } from '../../../../model/competition';
import { Journey } from '../../../../model/journey';
import { Match } from '../../../../model/match';
import { Student } from '../../../../model/student';
import { Team } from '../../../../model/team';


@Component({
  selector: 'page-classification',
  templateUrl: 'classification.html'
})
export class ClassificationPage {

  public competition: Competition;
  public journeys: Array<Journey>;
  public matchesJourneys: Array<Array<Match>>;
  public participants: Array<Participant>;

  public scores: Array<Score>;
  public odd: boolean;

  constructor(
    public navCtrl: NavController,
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
  private getJourneys(refresher?: Refresher): void {
    this.journeyService.getJourneysCompetition(this.competition.id).finally(() => {
      refresher ? refresher.complete() : null;
    }).subscribe(
      ((journeys: Array<Journey>) => {
        this.journeys = journeys;
        this.getMatches();
      }),
      (error => {
        this.ionicService.removeLoading();
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      }));
  }
  /**
   * This method returns the matches of each journey
   * and calls the getParticipants method
   */
  private getMatches(): void {
   let countJourneys = 0;
    this.matchesJourneys = [];
    for (let _j = 0; _j < this.journeys.length; _j++) {
      this.matchesJourneys[_j] = [];
      this.journeyService.getMatchesJourneyDetails(this.journeys[_j].id, this.competition).subscribe(
      ((matches: Array<Match>) => {
        countJourneys ++;
        for (let _m = 0; _m < matches.length; _m++) {
          this.matchesJourneys[_j][_m] = new Match();
          this.matchesJourneys[_j][_m] = matches[_m];
        }
         if ( countJourneys === this.journeys.length ) {
           this.getParticipants();
          }
      }),
      (error => {
        this.ionicService.removeLoading();
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      }));
    }
  }
  /**
   * This method returns the participants of the current competition
   * and calls the getScores method
   */
  private getParticipants(): void {
    this.participants = [];
    if (this.competition.mode === 'Individual') {
      this.competitionService.getStudentsCompetition(this.competition.id)
      .subscribe(( (students: Array<Student>) => {
        students.length % 2 === 0 ? this.odd = false : this.odd = true;
        for (let _s = 0; _s < students.length; _s++) {
          this.participants[_s] = {
            id: +students[_s].id,
            name: students[_s].name.concat(' ', students[_s].surname)
          };
        }
        this.getScores();
      }),
      (error => {
        this.ionicService.removeLoading();
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      }));
      } else {
      this.competitionService.getTeamsCompetition(this.competition.id)
      .subscribe(( (teams: Array<Team>) => {
        teams.length % 2 === 0 ? this.odd = false : this.odd = true;
        for (let _t = 0; _t < teams.length; _t++) {
          this.participants[_t] = {
            id: +teams[_t].id,
            name: teams[_t].name
          };
        }
        this.getScores();
      }),
      (error => {
        this.ionicService.removeLoading();
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      }));
      }
  }
  /**
   * This method computes the score of each participant
   * (position, points and played, won, draw and lost games)
   */
  private getScores(): void {
      this.scores = [];
      for (let _p = 0; _p < this.participants.length; _p++) {
        let score = { position: 0, name: this.participants[_p].name,
                       played: 0, won: 0, draw: 0, lost: 0, points: 0};
        for (let _j = 0; _j < this.journeys.length; _j++) {
          let found = false;
          for (let _m = 0; _m < this.matchesJourneys[_j].length && !found; _m++) {
            if ( +this.participants[_p].id === this.matchesJourneys[_j][_m].playerOne ||
            +this.participants[_p].id === this.matchesJourneys[_j][_m].playerTwo ) {
              if ( this.matchesJourneys[_j][_m].winner === +this.participants[_p].id ) {
                score.points = score.points + 3;
                score.won = score.won + 1;
                score.played = score.played + 1;
              } else if ( this.matchesJourneys[_j][_m].winner === 1 ) {
                score.points = score.points + 1;
                score.draw = score.draw + 1;
                score.played = score.played + 1;
              } else if ( this.matchesJourneys[_j][_m].winner === 2
              || this.matchesJourneys[_j][_m].winner === 0 ) {
              } else {
                score.lost = score.lost + 1;
                score.played = score.played + 1;
              }
              found = true;
            }
          }
        }
        this.scores.push(score);
      }
      this.scores.sort(function (a, b) {
        return (b.points - a.points);
      });
      for (let _s = 0; _s < this.scores.length; _s++) { this.scores[_s].position = _s + 1; }
      this.ionicService.removeLoading();
  }

}

export interface Score {
  position: number;
  name: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
}

export interface Participant {
  id: number;
  name: string;
}
