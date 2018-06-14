import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IonicService } from '../../../providers/ionic.service';
import { UtilsService } from '../../../providers/utils.service';
import { GroupService } from '../../../providers/group.service';
import { CompetitionService } from '../../../providers/competition.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Team } from '../../../model/team';
import { Student } from '../../../model/student';

@Component({
  selector: 'page-teams',
  templateUrl: 'teams.html'
})
export class TeamsPage {

  public competitionId: string;
  public teams: Array<Team>;
  public allStudents: Array<Array<Student>>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public ionicService: IonicService,
    public utilsService: UtilsService,
    public groupService: GroupService,
    public competitionService: CompetitionService,
    public translateService: TranslateService) {}

  ionViewDidLoad() {
    this.ionicService.showLoading(this.translateService.instant('APP.WAIT'));
    this.competitionId = this.navParams.get('competitionId');
    this.getTeams();
  }

  /**
   * This method returns the teams list of the current competition
   */
  private getTeams(): void {
    this.competitionService.getTeamsCompetition(this.competitionId)
    .subscribe((teams => {
        this.teams = teams,
        this.getStudents();
      }),
      (error => {
        this.ionicService.removeLoading();
        this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
      }));
  }
  /**
   * This method returns the students list of each team
   */
  private getStudents(): void {
    let countTeams = 0;
    this.allStudents = [];
    for (let _t = 0; _t < this.teams.length; _t++) {
    this.competitionService.getStudentsTeam(+this.teams[_t].id)
    .subscribe( (students => {
      this.allStudents[_t] = students;
      this.teams[_t].numPlayers = students.length;
      countTeams = countTeams + 1;
      countTeams === this.teams.length ? this.ionicService.removeLoading() : null;
    }),
    (error => {
      this.ionicService.removeLoading();
      this.ionicService.showAlert(this.translateService.instant('APP.ERROR'), error);
    }));
    }
  }

}
