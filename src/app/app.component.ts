import { Component, OnInit, OnDestroy,  ChangeDetectorRef,AfterContentChecked } from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { Subscription } from 'rxjs';
import { LoaderService } from './_services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked  {
  title = 'links-web';
  loading = false;
  subscription: Subscription;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private changeDetector: ChangeDetectorRef
  ) {
    //show loading spinner when route change
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.loading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  ngAfterContentChecked() : void {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    this.subscription = this.loaderService.loadingState.subscribe(isLoading => {
      this.loading = isLoading;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
