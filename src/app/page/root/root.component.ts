import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {NodeViewer} from '../../com/node-viewer/card-viewer.component';
import {ViewService} from '../../service/util/view.service';
import {TokenService} from '../../service/token.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit, AfterViewChecked {
  @ViewChild('popupContainer', { read: ViewContainerRef, static: true }) popupContainerRef: ViewContainerRef;

  back() {
    window.stop();
    window.history.back();
  }
  refresh() { location.reload(); }
  logout() {
    this.tokenService.invalidateToken(this.viewService.admin)
      .subscribe(() => this.router.navigate([this.viewService.admin ? '/admin/login' : '/login']));
  }

  constructor(
    public viewService: ViewService,
    private popupService: NodeViewer,
    private tokenService: TokenService,
    private authService: TokenService, // To init the TokenService and HttpService
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.popupService.popupContainerRef = this.popupContainerRef;
  }

  ngAfterViewChecked(): void {
    if (this.viewService.changed) {
      this.viewService.changed = false;
      this.cdRef.detectChanges();
    }
  }
}
