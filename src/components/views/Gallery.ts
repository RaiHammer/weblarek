import { Component } from '../base/Component';

interface GalleryData {
    items: HTMLElement[];
}

export class Gallery extends Component<GalleryData> {
    protected galleryElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.galleryElement = this.container.querySelector('.gallery') as HTMLElement;
    }

    render(data: GalleryData): HTMLElement {
        this.setItems(data.items);
        return this.container;
    }

    private setItems(items: HTMLElement[]): void {
        this.galleryElement.innerHTML = '';
        items.forEach(item => this.galleryElement.appendChild(item));
    }
}