import {AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {NodeViewer} from '../../com/node-viewer/card-viewer.component';
import {ViewService} from '../../service/util/view.service';
import {TokenService} from '../../service/token.service';

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
    private authService: TokenService, // To init the TokenService and HttpService
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
