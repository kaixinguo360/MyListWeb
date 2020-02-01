import {ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {NodeViewer} from '../com/node-viewer/card-viewer.component';
import {ViewService} from '../service/util/view.service';
import {TokenService} from '../service/token.service';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {TagSelectorComponent} from '../com/tag-selector/tag-selector.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../service/util/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {
  @ViewChild('popupContainer', { read: ViewContainerRef, static: true }) popupContainerRef: ViewContainerRef;

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private titleService: Title,

    public view: ViewService,
    private popupService: NodeViewer,
    private tokenService: TokenService,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    // @Autowired
    this.popupService.popupContainerRef = this.popupContainerRef;
    this.httpService.tokenService = this.tokenService;
    this.view.tokenService = this.tokenService;
    this.view.titleService = this.titleService;
    this.view.router = this.router;
    this.view.cdRef = this.cdRef;
    this.view.matSnackBar = this.matSnackBar;
    TagSelectorComponent.dialog = this.matDialog;
  }
}
