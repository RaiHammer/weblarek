import { Component } from '../base/Component';

interface GalleryData {
    items: HTMLElement[];
}

export class Gallery extends Component<GalleryData> {
    protected galleryElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        // Ищем элемент внутри контейнера, а не в document
        this.galleryElement = this.container;
    }

    render(data: GalleryData): HTMLElement {
        this.setItems(data.items);
        return this.container;
    }

    private setItems(items: HTMLElement[]): void {
        // Проверяем что элемент существует
        if (this.galleryElement) {
            this.galleryElement.innerHTML = '';
            items.forEach(item => this.galleryElement.appendChild(item));
        }
    }
}