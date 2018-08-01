define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Sprite {
        constructor(data, idx) {
            this.id = data.assets[idx].id;
            this.path = data.assets[idx].u + data.assets[idx].p;
            this.width = data.assets[idx].w;
            this.height = data.assets[idx].h;
            this.opacity = data.layers[idx].ks.o.k;
            this.rotation = data.layers[idx].ks.r.k;
            this.pos = data.layers[idx].ks.p.k;
            this.ap = data.layers[idx].ks.a.k;
            this.scale = data.layers[idx].ks.s.k;
            if (data.layers[idx].ef) {
                this.skew = data.layers[idx].ef[0].ef[5].v.k;
                this.skewAxis = data.layers[idx].ef[0].ef[6].v.k;
            }
            else {
                this.skew = null;
                this.skewAxis = null;
            }
            this.img = null;
            this.loaded = false;
            this.parent = null;
        }
    }
    exports.Sprite = Sprite;
});
//# sourceMappingURL=Sprite.js.map