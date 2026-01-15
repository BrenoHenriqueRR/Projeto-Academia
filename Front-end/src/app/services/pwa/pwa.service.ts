import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PwaService {
    private promptEvent: any;
    showButton = false;

    constructor() {
        window.addEventListener('beforeinstallprompt', (event: any) => {
            event.preventDefault();
            this.promptEvent = event;
            this.showButton = true;
        });
    }

    installPwa() {
        if (this.promptEvent) {
            this.promptEvent.prompt();
            this.promptEvent.userChoice.then((choiceResult: { outcome: string }) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                this.promptEvent = null;
                this.showButton = false;
            });
        }
    }
}
