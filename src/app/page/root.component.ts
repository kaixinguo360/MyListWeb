import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ViewService} from '../service/view.service';
import {TokenService} from '../service/token.service';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {MatDialog, MatSnackBar} from '@angular/material';
import {HttpService} from '../service/http.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {

  constructor(
    private router: Router,
    private location: Location,
    private cdRef: ChangeDetectorRef,
    private matDialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private titleService: Title,

    public view: ViewService,
    private tokenService: TokenService,
    private httpService: HttpService,
  ) { }

  ngOnInit() {
    // @Autowired
    this.httpService.tokenService = this.tokenService;
    this.view.tokenService = this.tokenService;
    this.view.titleService = this.titleService;
    this.view.router = this.router;
    this.view.location = this.location;
    this.view.cdRef = this.cdRef;
    this.view.matSnackBar = this.matSnackBar;
  }
}
