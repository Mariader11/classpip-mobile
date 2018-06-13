import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { CompetitionService } from './competition.service';
import { AppConfig } from '../app/app.config';

import { Competition } from '../model/competition';
import { Journey } from '../model/journey';
import { Match } from '../model/match';
import { Student } from '../model/student';

@Injectable()
export class JourneyService {

  constructor(
    public http: Http,
    public utilsService: UtilsService,
    public competitionService: CompetitionService) { }


  /**
  * GET: return the list of journeys of a competition
  * @return {Observable<Array<Journey>>} returns the list of journeys
  */
  public getJourneysCompetition(idCompetition: string | number): Observable<Array<Journey>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = AppConfig.COMPETITION_URL + '/' + idCompetition + AppConfig.JOURNEYS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Journey.toObjectArray(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * GET: return the list of matches of a journey
  * @return {Observable<Array<Match>>} returns the list of matches
  */
  private getMatchesJourney(idJourney: string | number): Observable<Array<Match>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = AppConfig.JOURNEY_URL + '/' + idJourney + AppConfig.MATCHES_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Match.toObjectArray(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * GET: return the list of matches of a journey with participants details
  * @return {Observable<Array<Match>>} returns the list of matches
  */
  public getMatchesJourneyDetails(idJourney: string | number, competition: Competition): Observable<Array<Match>> {
    const ret: Array<Match> = new Array<Match>();
    let firstTime: boolean;

    return Observable.create(observer => {
      this.getMatchesJourney(idJourney).subscribe(matches => {
        matches.forEach(match => {
          if (competition.mode === 'Individual') {
          this.competitionService.getStudentsCompetition(competition.id)
          .subscribe( students => {
            firstTime = true;
            students.forEach(student => {
              if ( +student.id === match.playerOne ) {
                match.namePlayerOne = student.name + ' ' + student.surname;
              }
              if ( +student.id === match.playerTwo ) {
                match.namePlayerTwo = student.name + ' ' + student.surname;
              }
              if ( 0 === match.playerOne) {
                match.namePlayerOne = 'Ghost';
              }
              if ( 0 === match.playerTwo) {
                match.namePlayerTwo = 'Ghost';
              }
              if (match.namePlayerOne && match.namePlayerTwo && firstTime) {
                firstTime = false;
                ret.push(match);
              }
              if (ret.length === matches.length) {
                observer.next(ret);
                observer.complete();
              }
            });
          }, error => observer.error(error));
        } else {
          this.competitionService.getTeamsCompetition(competition.id)
          .subscribe( teams => {
            firstTime = true;
            teams.forEach(team => {
              if ( +team.id === match.playerOne ) {
                match.namePlayerOne = team.name;
              }
              if ( +team.id === match.playerTwo ) {
                match.namePlayerTwo = team.name;
              }
              if ( 0 === match.playerOne) {
                match.namePlayerOne = 'Ghost';
              }
              if ( 0 === match.playerTwo) {
                match.namePlayerTwo = 'Ghost';
              }
              if (match.namePlayerOne && match.namePlayerTwo && firstTime) {
                firstTime = false;
                ret.push(match);
              }
              if (ret.length === matches.length) {
                observer.next(ret);
                observer.complete();
              }
            });
          }, error => observer.error(error));
        }
        });
    }, error => observer.error(error));
    });
  }
}
