import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {NodeViewer} from '../../com/node-viewer/card-viewer.component';
import {ViewService} from '../../service/util/view.service';
import {TokenService} from '../../service/token.service';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit, AfterViewChecked {
  @ViewChild('popupContainer', { read: ViewContainerRef, static: true }) popupContainerRef: ViewContainerRef;

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private titleService: Title,
    private popupService: NodeViewer,
    private tokenService: TokenService,
    private authService: TokenService, // To init the TokenService and HttpService
    public view: ViewService,
  ) { }

  ngOnInit() {
    this.popupService.popupContainerRef = this.popupContainerRef;
    this.view.tokenService = this.tokenService;
    this.view.router = this.router;
  }

  ngAfterViewChecked(): void {
    if (this.view.changed) {
      this.view.changed = false;
      this.titleService.setTitle('MyList - ' + this.view.config.title);
      this.cdRef.detectChanges();
    }
  }
}
