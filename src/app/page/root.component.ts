import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {NodeViewer} from '../com/node-viewer/card-viewer.component';
import {ViewService} from '../service/util/view.service';
import {TokenService} from '../service/token.service';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {TagSelectorComponent} from '../com/tag-selector/tag-selector.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {
  @ViewChild('popupContainer', { read: ViewContainerRef, static: true }) popupContainerRef: ViewContainerRef;

  ngOnInit() {
    this.popupService.popupContainerRef = this.popupContainerRef;
    this.view.tokenService = this.tokenService;
    this.view.router = this.router;
    this.view.cdRef = this.cdRef;
    TagSelectorComponent.dialog = this.matDialog;
  }

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private titleService: Title,
    private popupService: NodeViewer,
    private tokenService: TokenService,
    private authService: TokenService, // To init the TokenService and HttpService
    public view: ViewService,
    private matDialog: MatDialog,
  ) { }
}
