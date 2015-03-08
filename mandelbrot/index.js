window.onload = startPage;

function abs(a,b)   {  return (a*a) + (b * b); }

function calcAbs(a) { return abs(a[0], a[1]); }
                            //(x2-y2, 2xy)
function calcZ(a) { return [(a[0]*a[0]) - (a[1]*a[1]), 2*a[0]*a[1]];}

function sumZ(a,b)  { return [a[0] + b[0], a[1] + b[1]];}

                            //(ac-bd, ad+bc)
function sumComplex(a,b) { return [a[0]*b[0] - a[1] * b[1], a[0]*b[1] + a[1] * b[0]]; } 

var S = 2000;
var maxvalue = 2;
var MAX_ITERATIONS = 100
var middle = S / 2;
var ratio = maxvalue/middle;



var canvas,ctx, imagedata,pixels;

function startPage() {
   
    canvas = document.getElementById("c");
    ctx = canvas.getContext("2d");
    
    canvas.width = S;
    canvas.height = S;
    
    
    imagedata = ctx.getImageData(0,0,S,S);
    pixels = imagedata.data;
    
    var from = maxvalue * -1
    var to = maxvalue;    

    for (var i = 0; i < S; i++)
    {
        for (var j = 0; j < S; j++)
        {
            if (i == 500 && j == 500) debugger;
            drawIJ(i, j);
        }
    }
  
    
    ctx.putImageData(imagedata,0,0);
           
}


//file:///C:/Users/Ricardo/Desktop/mandelbrot/index.html

function drawIJ(i,j){
    
    var coord = [i,j];

    var cc = convertToComplexCoord(coord);
    var c = adaptToMaxValue(cc);
        
    var curIterations = 0;

    var lastIterationResult = c;

    var lastAbsResult = 0;

    for (;curIterations <= MAX_ITERATIONS; curIterations++)
    {
        var res = 0;

        if (curIterations == 0)
        {
            lastAbsResult = calcAbs(c);

            res = lastAbsResult;
        }
        else
        {
            debugger;
            var z2 = calcZ(lastIterationResult);

            lastIterationResult = sumZ(z2,c);

            res = calcAbs(lastIterationResult);

            //se o resultado for o mesmo que o anterior... treta

            lastAbsResult = res;

        }

        if (res >= 4){
            break;
        }

    }
    setColor(coord,getColor(curIterations));
    

    
}
function setColor(q, color){
    
    var offset = (q[0] + q[1] * imagedata.width) * 4;
    
    pixels[offset] = color[0];
    pixels[offset+1] = color[1];
    pixels[offset+2] = color[2];
    pixels[offset+3] = 255;
}

var colorcache = {};

function getColor(i){
    
    if (i == 0) return [0,0,0];
    if (i == MAX_ITERATIONS) return [0,0,0];  
    else{
     
        if (!colorcache[i]) {
            //2 primeiros algarismos são a cor
            //o ultimo é o brilho

            if (i > 360) i = i - 360;

            var cor = parseInt(i / 10);
            var nivelBrilho = i % 10;

            var luminancia = (nivelBrilho * 10) - 5;

            if (cor == 0) cor = 12; //quero que comece com verde

            var res = hsl2rgb(cor * 10,100,luminancia); 

            colorcache[i] = res;
        }   
        return colorcache[i];
    }
    
}


function getComplexQuad(a){
    
    var q = [];
    
    if (a[0] >= 300) { q.push(1); } else { q.push(-1); }
    if (a[1] >= 300) { q.push(1); } else {q.push(-1); }
    
    return q;
}

function convertToComplexCoord(a){

    var quad = getComplexQuad(a);
    
    return [a[0] - middle, a[1]*-1 + middle];
}

function adaptToMaxValue(a){
     return [a[0] * ratio, a[1] * ratio];
        
}
function hsl2rgb (h, s, l) {

    var r, g, b, m, c, x

    if (!isFinite(h)) h = 0
    if (!isFinite(s)) s = 0
    if (!isFinite(l)) l = 0

    h /= 60
    if (h < 0) h = 6 - (-h % 6)
    h %= 6

    s = Math.max(0, Math.min(1, s / 100))
    l = Math.max(0, Math.min(1, l / 100))

    c = (1 - Math.abs((2 * l) - 1)) * s
    x = c * (1 - Math.abs((h % 2) - 1))

    if (h < 1) {
        r = c
        g = x
        b = 0
    } else if (h < 2) {
        r = x
        g = c
        b = 0
    } else if (h < 3) {
        r = 0
        g = c
        b = x
    } else if (h < 4) {
        r = 0
        g = x
        b = c
    } else if (h < 5) {
        r = x
        g = 0
        b = c
    } else {
        r = c
        g = 0
        b = x
    }

    m = l - c / 2
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return [r,g,b];

}