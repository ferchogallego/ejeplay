import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.scss']
})
export class PreguntasComponent implements OnInit {
  load = false;
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.load = true;
    }, 2000);
  }

}
