import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Competition } from '../../model/competition';
import { CompetitionService } from '../../providers/competition.service';
import { GroupService } from '../../providers/group.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { IonicService } from '../../providers/ionic.service';
import { UtilsService } from '../../providers/utils.service';
/*
  Generated class for the Competitions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-competitions',
  templateUrl: 'competitions.html'
})
export class CompetitionsPage {

  public competitions: Array<Competition>;

  constructor(
    public ionicService: IonicService,
    public utilsService: UtilsService,
    public groupService: GroupService,
    public competitionService: CompetitionService,
    public translateService: TranslateService,
    public navCtrl: NavController,
    public navParams: NavParams) {}

  ionViewDidLoad() {
    // tslint:disable-next-line:no-console
    console.log('ionViewDidLoad CompetitionsPage');
  }

}
