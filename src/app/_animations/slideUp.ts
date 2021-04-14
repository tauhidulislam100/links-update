import { transition, style, state, trigger, animate } from '@angular/animations';

export const slideUpAnimation = trigger('slideUpAnimation', [
    state('*', style({ position: 'relative' })),

    transition(':enter', [
        style({opacity: 0, left: '-100%'}),

        animate('0.3s', style({opacity: 1, left: '0%'}))
    ]),

    transition(':leave', [
        animate('0.3s', style({opacity: 0, left: '-100%'}))
    ])
]);