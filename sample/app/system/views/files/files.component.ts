import { Component, OnInit, ViewChild } from '@angular/core';

import { FsMessage } from '@firestitch/message';

import { NavService } from 'app/core';
import { map } from 'rxjs/operators';
import { FsFileManagerConfig } from '@firestitch/file-manager';
import { SystemData } from '@app/system/data';


@Component({
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  public config: FsFileManagerConfig;

  constructor(
    private _systemData: SystemData,
    private _message: FsMessage,
    private _navService: NavService,
  ) { }

  ngOnInit() {
    this._configFileManager();
    this._setTitle();
  }

  private _setTitle() {
    this._navService.setListTitle('System', 'File Manager');
  }

  private _configFileManager() {
    this.config = {
      fetch: (path) => {
        const query = { path: path };
        return this._systemData.filesGet(query);
      },
      deleteFile: (path) => {
        const query = { path: path };
        return this._systemData.filesDelete(query)
      },
      deleteDirectory: (path) => {
        const query = { path: path };
        return this._systemData.filesDirectoriesDelete(query)
      },
      createDirectory: (path) => {
        const query = { path: path };
        return this._systemData.filesDirectoriesPost(query)
      },
      download: (path) => {
        const query = { path: path };
        return this._systemData.filesDownload(query);
      },
      upload: (path, file) => {
        const query = { path: path, file: file, filename: file.name };
        return this._systemData.filesUpload(query)
        .pipe(
          map(response => response.storage_object)
        );
      }
    };
  }

}
