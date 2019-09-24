import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as camera from 'nativescript-camera';
import { knownFolders, path } from 'tns-core-modules/file-system';
import { ImageSource } from 'tns-core-modules/image-source/image-source';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'my-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {
  @Input() hero: Hero;
  @Output() close = new EventEmitter();

  heroImagePath = ''; // stores path to image

  error: any;
  navigated = false; // true if navigated here

  constructor(
    private heroService: HeroService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        const id = +params['id'];
        this.navigated = true;
        this.heroService.getHero(id).subscribe(hero => (this.hero = hero));
      } else {
        this.navigated = false;
        this.hero = new Hero();
      }
    });
  }

  save(): void {
    this.heroService.save(this.hero).subscribe(hero => {
      this.hero = hero; // saved hero, w/ id if new
      this.goBack(hero);
    }, error => (this.error = error)); // TODO: Display error message
  }

  goBack(savedHero: Hero = null): void {
    this.close.emit(savedHero);
    if (this.navigated) {
      window.history.back();
    }
  }

  async handleTakePhoto(heroName: string) {
    const isAvailable = camera.isAvailable();
    if (isAvailable) {

      this.heroImagePath = await camera
        .takePicture()
        .then(async imageAsset => {
          const source = new ImageSource();
          const imageSource = await source.fromAsset(imageAsset);
          const folderPath = knownFolders.documents().path;
          const fileName = `${heroName}.jpg`;
          const heroImagePath = path.join(folderPath, fileName);
          const saved: boolean = imageSource.saveToFile(heroImagePath, 'jpg');
          if (saved) {
            return heroImagePath;
          }
          return null;
        })
        .catch(err => {
          console.log('Error -> ' + err.message);
          return null;
        });
    }
  }
}

