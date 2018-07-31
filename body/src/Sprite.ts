export class Sprite
{
    public id: string;
    public path: string;
    public width: number;
    public height: number;

    public opacity: number;
    public rotation: number;
    public pos: number[];
    public ap: number[];
    public scale: number[];

    public skew: number;
    public skewAxis: number;

    public img: HTMLImageElement;
    public loaded: boolean;

    public parent: Sprite;

    constructor(data: any, idx: number)
    {
        this.id = data.assets[idx].id;
        this.path = data.assets[idx].u + data.assets[idx].p;
        this.width = data.assets[idx].w;
        this.height = data.assets[idx].h;

        this.opacity = data.layers[idx].ks.o.k;
        this.rotation = data.layers[idx].ks.r.k;
        this.pos = data.layers[idx].ks.p.k;
        this.ap = data.layers[idx].ks.a.k;
        this.scale = data.layers[idx].ks.s.k;

        if (data.layers[idx].ef)        // TODO better condition
        {
            this.skew = data.layers[idx].ef[0].ef[5].v.k;
            this.skewAxis = data.layers[idx].ef[0].ef[6].v.k;
        }
        else
        {
            this.skew = null;
            this.skewAxis = null;
        }

        this.img = null;
        this.loaded = false;

        this.parent = null;
    }
}