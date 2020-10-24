import Vue from 'vue'
import './index.css'


let kp = 0.020;
let ki = 0.001;
let kd = 500;
function poscontroller() {
    let line = document.getElementById('targetline');
    let linepos = 1;
    (line as HTMLElement).style.top = (linepos * 100) + '%';

    let boxpos = 1;
    let signal = 0;
    let gravity = 0.00098;
    let vertical = 0;


    let err = 0;
    let errp = 0;
    let ci = 0;
    let deltaTime = 20;


    let timer = setInterval(function () {

        let box = document.getElementById('controlbox');
        //console.log(`linepos:${linepos},boxpos:${boxpos}`);
        err = linepos - boxpos;
        ci += err;
        //console.log(`err:${err},ci:${ci}`);
        signal = kp * (err + ki * deltaTime * ci + kd / deltaTime * (err - errp));
        //console.log(`err:${err},i:${ki * deltaTime * ci}+d:${kd / deltaTime * (err - errp)}`);
        if (signal > gravity * 10) signal = gravity * 10;
        if (signal < 0) signal = 0;
        vertical += (signal - gravity);

        boxpos += vertical;

        (box as HTMLElement).style.top = (boxpos * 100) + '%';
        //console.log((box as HTMLElement).style.top);


        errp = err;


    }, deltaTime);

    return function (setlinepos: number, setboxpos: number) {
        linepos = setlinepos;
        boxpos = setboxpos;
        let line = document.getElementById('targetline');
        (line as HTMLElement).style.top = (linepos * 100) + '%';
    }


}

window.onload = function () {

    let controller = poscontroller();


    var example = new Vue({
        el: "#example",
        data: {
            message: 'Hello Vue!'
        }
    });

    let posbutton = document.getElementById('possubmit');
    let kbutton = document.getElementById('ksubmit');

    function posbuttonclick(e?: Event) {
        //let lp = (form as HTMLElement)['targetpos'].value;
        if (e)
            e.preventDefault();
        let lp = Number((document.getElementById('targetpos') as HTMLInputElement).value);
        let bp = Number((document.getElementById('boxpos') as HTMLInputElement).value);

        if (lp < 0 || lp > 100) {
            alert('Invalid target position');
            return;
        }
        if (bp < 0 || bp > 100) {
            alert('Invalid box position');
            return;
        }
        controller(lp / 100, bp / 100);

    }

    function kbuttonclick(e: Event) {
        e.preventDefault();
        kp = Number((document.getElementById('kp') as HTMLInputElement).value);
        ki = Number((document.getElementById('ki') as HTMLInputElement).value);
        kd = Number((document.getElementById('kd') as HTMLInputElement).value);
        posbuttonclick();
    }
    posbuttonclick();

    if (posbutton)
        posbutton.onclick = posbuttonclick;

    if (kbutton)
        kbutton.onclick = kbuttonclick;


}