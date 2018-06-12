import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { GradeService } from './grade.service';
import { MatterService } from './matter.service';
import { GroupService } from './group.service';
import { AppConfig } from '../app/app.config';

import { Competition } from '../model/competition';  //si
import { Teacher } from '../model/teacher';
import { Team } from '../model/team';
import { Match } from '../model/match';
import { Group } from '../model/group'; // si
import { Grade } from '../model/grade';
import { Matter } from '../model/matter';
import { Student } from '../model/student';

@Injectable()
export class CompetitionService {

  constructor(
    public http: Http,
    public utilsService: UtilsService,
    public groupService: GroupService,
    public gradeService: GradeService,
    public matterService: MatterService) { }

  /**
  * This method returns the list of competitions of the current
  * user groups with the group (grade and matter)
  * @return {Array<Competition>} returns the list of competitions
  */

  public getMyCompetitionsByGroup(group: Group): Observable<Array<Competition>> {
    const ret: Array<Competition> = new Array<Competition>();

    return Observable.create(observer => {
      this.getCompetitionsByGroup(group.id).subscribe(competitions => {
        competitions.forEach(competition => {
          competition.grade = group.grade;
          competition.matter = group.matter;
          ret.push(competition);
          if (ret.length === competitions.length) {
            observer.next(ret);
            observer.complete();
          }
        });
      }, error => observer.error(error));
    });
  }

  /**
  * This method returns the list of competitions by group
  * @return {Array<Competition>} returns the list of competitions
  */

  private getCompetitionsByGroup(groupId: string): Observable<Array<Competition>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = AppConfig.GROUP_URL + '/' + groupId + AppConfig.COMPETITIONS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Competition.toObjectArray(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * This method returns the list of competitions of
  * the current user logged into the application with
  * the group (grade and matter)
  * @return {Array<Competition>} returns the list of competitions
  */

  public getMyCompetitions(): Observable<Array<Competition>> {

    const ret: Array<Competition> = new Array<Competition>();

    return Observable.create(observer => {
     this.getCompetitions().subscribe(competitions => {
      competitions.forEach(competition => {
        this.groupService.getGroup(competition.groupId).subscribe(
         group => {
          this.gradeService.getGrade(group.gradeId).subscribe(
           grade => {
            competition.grade = grade;
            this.matterService.getMatter(group.matterId).subscribe(
             matter => {
              competition.matter = matter;
              ret.push(competition);
              if (ret.length === competitions.length) {
                observer.next(ret);
                observer.complete();
              }
             }, error => observer.error(error));
           }, error => observer.error(error));
         }, error => observer.error(error));
      });
     }, error => observer.error(error));
    });
  }


  /**
  * This method returns the list of competitions of
  * the current user logged into the application
  * @return {Array<Competition>} returns the list of competitions
  */

  private getCompetitions(): Observable<Array<Competition>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = this.utilsService.getMyUrl() + AppConfig.COMPETITIONS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Competition.toObjectArray(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * This method returns the competition by its id
  * @return {Observable<Competition>} returns the competition
  */
  public getCompetition(id: number | string): Observable<Competition> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.get(AppConfig.COMPETITION_URL + '/' + id, options)
      .map((response: Response, index: number) => Competition.toObject(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }


  /**
  * GET: get students of a competition
  * @return {Observable<Competition>} returns the list of students
  */
  public getStudentsCompetition(competitionId: string): Observable<Array<Student>> {

    const options: RequestOptions = new RequestOptions({
     headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
    const url: string = AppConfig.COMPETITION_URL + '/' + competitionId + AppConfig.STUDENTS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Student.toObjectArray(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

    /**
  * This method returns the list of competitions
  * of a team with the group (grade and matter)
  * @return {Observable<Array<Competition>>} returns the list of competitions
  */
 public getMyCompetitionsGroup(teamId: number): Observable<Array<Competition>> {

  const ret: Array<Competition> = new Array<Competition>();

  return Observable.create(observer => {
    this.getCompetitionsTeam(teamId).subscribe(competitions => {
      competitions.forEach(competition => {
        this.groupService.getGroup(competition.groupId).subscribe(
          group => {
            this.gradeService.getGrade(group.gradeId).subscribe(
              grade => {
               competition.grade = grade;
                 this.matterService.getMatter(group.matterId).subscribe(
                   matter => {
                    competition.matter = matter;
                    ret.push(competition);
                    if (ret.length === competitions.length) {
                    observer.next(ret);
                    observer.complete();
                    }
                  }, error => observer.error(error));
              }, error => observer.error(error));
          }, error => observer.error(error));
      });
    }, error => observer.error(error));
  });
}

/**
* This method returns the list of competitions of a team
* @return {Observable<Array<Competition>>} returns the list of competitions
*/
public getCompetitionsTeam(teamId: number): Observable<Array<Competition>> {
  const options: RequestOptions = new RequestOptions({
    headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
  });
return this.http.get(AppConfig.TEAM_URL + '/' + teamId + AppConfig.COMPETITIONS_URL, options)
.map((response: Response, index: number) => Competition.toObjectArray(response.json()))
.catch((error: Response) => this.utilsService.handleAPIError(error));
}


/**
* This method returns the list of teams of a competition
* @return {Observable<Array<Team>>} returns the list of competitions
*/
public getTeamsCompetition(competitionId: number | string): Observable<Array<Team>> {
  const options: RequestOptions = new RequestOptions({
    headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
   });
  return this.http.get(AppConfig.COMPETITION_URL + '/' + competitionId + AppConfig.TEAMS_URL, options)
    .map((response: Response, index: number) => Team.toObjectArray(response.json()))
    .catch((error: Response) => this.utilsService.handleAPIError(error));
}

/**
* This method returns the list of students of a team
* @return {Observable<Array<Student>>} returns the list of students
*/
public getStudentsTeam(teamId: number): Observable<Array<Student>> {
  const options: RequestOptions = new RequestOptions({
   headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
  });
  return this.http.get(AppConfig.TEAM_URL + '/' + teamId + AppConfig.STUDENTS_URL, options)
    .map((response: Response, index: number) => Student.toObjectArray(response.json()))
    .catch((error: Response) => this.utilsService.handleAPIError(error));
}

/**
* This method returns the list of teams of a student
* @return {Observable<Array<Team>>} returns the list of teams
*/
public getTeamsStudent(studentId: number): Observable<Array<Team>> {
  const options: RequestOptions = new RequestOptions({
    headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
  });
  return this.http.get(AppConfig.STUDENT_URL + '/' + studentId + AppConfig.TEAMS_URL, options)
    .map((response: Response, index: number) => Team.toObjectArray(response.json()))
    .catch((error: Response) => this.utilsService.handleAPIError(error));
}

}
