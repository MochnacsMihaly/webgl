import { Sprite } from "./Sprite";

export class Script
{
    protected _httpRequest: XMLHttpRequest;
    //protected _ctx: CanvasRenderingContext2D;
    protected _canvas: HTMLCanvasElement;
    protected _jsonImg: Sprite[];
    
    constructor(path: string)
    {
        this._canvas = <HTMLCanvasElement> document.getElementById('canvas');
        //this._ctx = this._canvas.getContext('2d');
        this._jsonImg = new Array<Sprite>();
        this.loadJSON(path);
    }

    protected loadJSON(path: string): void
    {
        this._httpRequest = new XMLHttpRequest();
        this._httpRequest.onreadystatechange = () => this.httpRequest();
       
        this._httpRequest.open("GET", path, true);
        this._httpRequest.send();
    }

    protected httpRequest(): void
    {
        if (this._httpRequest.readyState === XMLHttpRequest.DONE) 
        {
            if (this._httpRequest.status === 200)
            {
                this.processData(JSON.parse(this._httpRequest.responseText));
            }
        }
    }

    protected processData(data: any): void
    {
        let idx: number = 0;

        this._canvas.width = data.w;
        this._canvas.height = data.h;

        for (let asset of data.assets)
        {
            this._jsonImg.push(new Sprite(data, idx));
            let img = document.createElement("img");
            this._jsonImg[idx].img = img;

            img.src = asset.u + asset.p;
            img.onload = this.onImgLoad.bind(this, this._jsonImg[idx]);

            idx++;
        }
    }

    protected onImgLoad(sprite: Sprite): void
    {
        sprite.loaded = true;
        this.render();                  // Render every image on every new image load
    }

    protected render(): void
    {
        //this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);     // Clearing the canvas

        for (let idx: number = this._jsonImg.length - 1; idx >= 0; idx--)       // Drawing the images in reverse order
        {
            let sprite = this._jsonImg[idx];

            if (sprite.loaded)
            {
                this.drawImage(sprite);
            }
        }
    }

    protected drawImage(sprite: Sprite): void
    {   
        


        /*this._ctx.save();                                                   // Save the default state of the canvas

        this._ctx.translate(sprite.pos[0], sprite.pos[1]);                  // Position

        this._ctx.globalAlpha = sprite.opacity / 100;                       // Opacity
            
        this._ctx.scale(sprite.scale[0] / 100, sprite.scale[1] / 100);      // Scale

        this._ctx.rotate(sprite.rotation * Math.PI / 180);                  // Rotation
        
        if (sprite.skew)                                                    // Skew
        {
            this._ctx.transform(1, sprite.skew / 70 * Math.abs(Math.cos(sprite.skewAxis * Math.PI / 180)), sprite.skew / 70 * Math.abs(Math.sin(sprite.skewAxis * Math.PI / 180)), 1, 0, 0);
        }
 
        this._ctx.drawImage(sprite.img, -sprite.ap[0], -sprite.ap[1]);      // Anchor Point + Draw the image

        this._ctx.restore();                                                // Restore canvas to its starting state*/
    }
}