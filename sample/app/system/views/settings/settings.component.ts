import { Component, OnInit } from '@angular/core';

import { FsMessage } from '@firestitch/message';
import { groupBy, reduce } from 'lodash-es';

import { NavService } from 'app/core';
import { SystemData } from '@app/system/data';
import { SettingInterfaceType } from 'app/system/enums';


@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public groupedSettings = [];
  public groups = [];
  public settingInterfaceType = SettingInterfaceType;

  constructor(
    private _systemData: SystemData,
    private _message: FsMessage,
    private _navService: NavService
  ) { }

  ngOnInit() {
    this._setTitle();
    this._systemData.settingsGets()
    .subscribe(settings => {
      this.groupedSettings = groupBy(settings, (item) => {
        return item.group;
      });
      this.groups = Object.keys(this.groupedSettings);
    });
  }

  public save(group) {

    const settings = this.groupedSettings[group];
    const values = reduce(settings, (result, value, key) => {
      return (result[value.name] = value.value, result);
    }, {});

    this._systemData.settingsBulk({ group: group, values: values })
    .subscribe(response => {
      this._message.success('Changes Saved');
      this.groupedSettings[group] = response;
    });
  }

  private _setTitle() {
    this._navService.setListTitle('System', 'Settings');
  }
}
