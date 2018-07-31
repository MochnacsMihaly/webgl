define(["require", "exports", "./Sprite"], function (require, exports, Sprite_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Script {
        constructor(path) {
            this._canvas = document.getElementById('canvas');
            this._jsonImg = new Array();
            this.loadJSON(path);
        }
        loadJSON(path) {
            this._httpRequest = new XMLHttpRequest();
            this._httpRequest.onreadystatechange = () => this.httpRequest();
            this._httpRequest.open("GET", path, true);
            this._httpRequest.send();
        }
        httpRequest() {
            if (this._httpRequest.readyState === XMLHttpRequest.DONE) {
                if (this._httpRequest.status === 200) {
                    this.processData(JSON.parse(this._httpRequest.responseText));
                }
            }
        }
        processData(data) {
            let idx = 0;
            this._canvas.width = data.w;
            this._canvas.height = data.h;
            for (let asset of data.assets) {
                this._jsonImg.push(new Sprite_1.Sprite(data, idx));
                let img = document.createElement("img");
                this._jsonImg[idx].img = img;
                img.src = asset.u + asset.p;
                img.onload = this.onImgLoad.bind(this, this._jsonImg[idx]);
                idx++;
            }
        }
        onImgLoad(sprite) {
            sprite.loaded = true;
            this.render();
        }
        render() {
            for (let idx = this._jsonImg.length - 1; idx >= 0; idx--) {
                let sprite = this._jsonImg[idx];
                if (sprite.loaded) {
                    this.drawImage(sprite);
                }
            }
        }
        drawImage(sprite) {
        }
    }
    exports.Script = Script;
});
//# sourceMappingURL=Script.js.map