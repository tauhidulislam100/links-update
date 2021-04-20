import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @ViewChild('inner', { static: true }) inner: ElementRef<HTMLDivElement>;
  constructor(private renderer: Renderer2,) { }

  ngOnInit() {
    let width = 1;
    const interval = setInterval(() => {
        if(width < 100 && this.inner) {
            width +=1;
            this.renderer.setStyle(this.inner.nativeElement, 'width', width+'%');
        }
        if(width==100) {
            clearInterval(interval);
        }
    }, 25);
  }
}
