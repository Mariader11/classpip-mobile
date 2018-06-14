import { Component } from '@angular/core';
import { NavController, NavParams, Refresher } from 'ionic-angular';

import { Competition } from '../../model/competition';
import { CompetitionService } from '../../providers/competition.service';
import { GroupService } from '../../providers/group.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { IonicService } from '../../providers/ionic.service';
import { UtilsService } from '../../providers/utils.service';

import { LeaguePage } from './league/league';
import { TennisPage } from './tennis/tennis';
import { Role } from '../../model/role';
import { Group } from '../../model/group';
import { Team } from '../../model/team';

@Component({
  selector: 'page-competitions',
  templateUrl: 'competitions.html'
})
export class CompetitionsPage {

  public competitions: Array<Competition>;
  public myRole: Role;
  public role = Role;

  constructor(
    public ionicService: IonicService,
    public utilsService: UtilsService,
    public groupService: GroupService,
    public competitionService: CompetitionService,
    public translateService: TranslateService,
    public navCtrl: NavController,
    public navParams: NavParams) {
      this.competitions = [];
    }

  ionViewDidLoad() {
    this.ionicService.showLoading(this.translateService.instant('APP.WAIT'));
    this.myRole = this.utilsService.role;
    this.getMyCompetitionsInfo();
  }

  /**
   * This method returns the list of competitions from the
   * backend. This call is called on the ionViewDidLoad or the
   * refresh event
   * @param {Refresher} Refresher element
   */
  private getMyCompetitionsInfo(refresher?: Refresher): void {

    if (this.myRole === Role.SCHOOLADMIN) {
      this.ionicService.removeLoading();
    } else if (this.myRole === Role.TEACHER) {
        this.competitions = [];
        this.groupService.getMyGroups().subscribe(
          (( groups: Array<Group>) =>
           groups.map( group => {
            this.competitionService.getMyCompetitionsByGroup(group).finally(() => {
              refresher ? refresher.complete() : null;
              this.ionicService.removeLoading();
            }).subscribe(
             ((competitions: Array<Competition>) => {
              competitions.map( competition => {
                this.competitions.push(competition);
              })
            }),
            (error => {
              this.ionicService.removeLoading();
              this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
            }));
          })),
          (error => {
            this.ionicService.removeLoading();
            this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
          }));

    } else if (this.myRole === Role.STUDENT) {
      this.competitions = [];
      this.competitionService.getMyCompetitions().finally(() => {
        refresher ? refresher.complete() : null;
        this.ionicService.removeLoading();
      }).subscribe(
        ((competitions: Array<Competition>) => {
          competitions.map( competition => {
            this.competitions.push(competition);
          })
        }),
        (error => {
          this.ionicService.removeLoading();
          this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
        }));
      this.competitionService.getTeamsStudent(+this.utilsService.currentUser.userId).subscribe(
        ((teams: Array<Team>) =>
        teams.map( team => {
            this.competitionService.getMyCompetitionsGroup(+team.id).subscribe(
              ((competitions: Array<Competition>) =>
              competitions.map( competition => {
                  this.competitions.push(competition);
              })),
              (error => {
                this.ionicService.removeLoading();
                this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
              }));
        })),
        (error => {
          this.ionicService.removeLoading();
          this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
        }));
    }
  }



  goToCompetition(competition) {
    competition.type === 'Liga' ?
    this.navCtrl.push(LeaguePage, {competition: competition}) :
    this.navCtrl.push(TennisPage, {competition: competition});
  }
}
