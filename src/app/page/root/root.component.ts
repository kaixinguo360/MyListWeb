import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {NodeViewer} from '../../com/node-viewer/node-viewer.component';
import {ViewService} from '../../service/view.service';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit, AfterViewChecked {
  @ViewChild('popupContainer', { read: ViewContainerRef, static: true }) popupContainerRef: ViewContainerRef;
  private loading = this.viewService.loading;

  back() {
    window.stop();
    window.history.back();
  }
  refresh() { location.reload(); }

  constructor(
    public viewService: ViewService,
    private popupService: NodeViewer,
    private authService: AuthService, // To init the AuthService and ApiService
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.popupService.popupContainerRef = this.popupContainerRef;
  }

  ngAfterViewChecked(): void {
    if (this.loading !== this.viewService.loading) {
      this.cdRef.detectChanges();
    }
  }
}
