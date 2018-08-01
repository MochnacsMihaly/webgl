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
        


        /*this._ctx.save();                                                 // Save the default state of the canvas

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

    protected InitDemo(): void
    {
        loadTextResource('./shaders/shader.vs.glsl', function (vsErr, vsText) 
            {
                if (vsErr)
                {
                    alert('Fatal error getting vertex shader (see console)');
                    console.error(vsErr);
                } 
                else 
                {
                    loadTextResource('./shaders/shader.fs.glsl', function (fsErr, fsText)
                        {
                            if (fsErr)
                            {
                                alert('Fatal error getting fragment shader (see console)');
                                console.error(fsErr);
                            }
                            else
                            {
                                RunDemo(vsText, fsText);
                            }
                        }
                    );
                }
            }
        );
    }
    
    protected RunDemo(vertexShaderText: any, fragmentShaderText: any): void
    {
    
        var canvas = <HTMLCanvasElement> document.getElementById('game-surface');
        var gl = canvas.getContext('webgl');
    
        if (!gl)
        {
            console.log('WebGL not supported, falling back on experimental-webgl');
            gl = canvas.getContext('experimental-webgl');
        }
    
        if (!gl)
        {
            alert('Your browser does not support WebGL');
        }
    
        gl.clearColor(0.5, 0.5, 0.5, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);
    
        // Alpha transparency
        
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
        //
        // Create shaders
        // 
    
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
        gl.shaderSource(vertexShader, vertexShaderText);
        gl.shaderSource(fragmentShader, fragmentShaderText);
    
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
            return;
        }
    
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
            return;
        }
    
        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('ERROR linking program!', gl.getProgramInfoLog(program));
            return;
        }
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program!', gl.getProgramInfoLog(program));
            return;
        }
    
        //
        // Create buffer
        //
    
        var imgWidth = document.getElementById('wizard').x / 2 / 1000;
        var imgHeight = document.getElementById('wizard').y / 2 / 1000;
    
        var imgVertices = 
        [ 
              imgHeight,   imgWidth,    0, 0,
              imgHeight, - imgWidth,    0, 1,
            - imgHeight, - imgWidth,    1, 1,
            - imgHeight,   imgWidth,    1, 0
        ];
        
        var imgIndices =
        [
            0, 1, 2,
            0, 2, 3
        ];
    
        var boxVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(imgVertices), gl.STATIC_DRAW);
        
        var boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(imgIndices), gl.STATIC_DRAW);
    
        var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
        var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
        gl.vertexAttribPointer(
            positionAttribLocation, 			// Attribute location
            2, 									// Number of elements per attribute
            gl.FLOAT, 							// Type of elements
            gl.FALSE,
            4 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 									// Offset from the beginning of a single vertex to this attribute
        );
        gl.vertexAttribPointer(
            texCoordAttribLocation, 			// Attribute location
            2, 									// Number of elements per attribute
            gl.FLOAT, 							// Type of elements
            gl.FALSE,
            4 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            2 * Float32Array.BYTES_PER_ELEMENT 	// Offset from the beginning of a single vertex to this attribute
        );
    
        gl.enableVertexAttribArray(positionAttribLocation);
        gl.enableVertexAttribArray(texCoordAttribLocation);
    
        var img = new Image();
        img.src = "image.jpg";
        
        //
        // Create texture
        //
    
        var boxTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, boxTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            document.getElementById('wizard')
        );
    
        gl.bindTexture(gl.TEXTURE_2D, null);
    
        // Tell OpenGL state machine which program should be active.
    
        gl.useProgram(program);
        
        var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
        var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
        var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
    
        var worldMatrix = new Float32Array(16);
        var viewMatrix = new Float32Array(16);
        var projMatrix = new Float32Array(16);
        mat4.identity(worldMatrix);
        mat4.lookAt(
            viewMatrix, 
            [ 0,  0, -2], 
            [ 0,  0,  0], 
            [ 0,  1,  0]
        );
        mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 1.0, 1000.0);
    
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
        gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
        
        gl.bindTexture(gl.TEXTURE_2D, boxTexture);
        gl.activeTexture(gl.TEXTURE0);
        gl.drawElements(gl.TRIANGLES, imgIndices.length, gl.UNSIGNED_SHORT, 0);
    };

    protected loadTextResource = function (url: any, callback: any) 
    {
        var request = new XMLHttpRequest();
        request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
        request.onload = function ()
        {
            if (request.status < 200 || request.status > 299)
            {
                callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
            }
            else
            {
                callback(null, request.responseText);
            }
        };
        request.send();
    };
}