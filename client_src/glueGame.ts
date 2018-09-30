/** HOLD YOUR FACE TOGETHER */
/**
 * some ideas:
 * the mouth could flap, and knock the eyes off it
 * make the mouth out of actor segments and relax towards each other (tried with drawing, but it didn't want to cooperate)
 * make the eyeballs do laps around the nose?
 * each arrow key controls one eye, pushing out towards the edge, you need to not bang into the other eye?
 * what if the eye was the thing that was being juggled?
*/

import * as m from "mglue";
import {Vector, Color, Keyboard, Random, TextDrawer, Sound} from "mglue";
import { DrawingRect } from "../../mglue/dist/dist/Drawing";

let r = new m.Random();
// fitzpatrick scale skintones (the ones from emoji set)
// these tones taken from twimoji

let skinTones : any= ["#F7DECE", "#F3D2A2", "#D5AB88", "#AF7E57", "#7C533E"];
let featureTones : any = ["#C1694F", "#C1694F", "#C1694F", "#915A34", "#3D2E24"];
let eyeTones : any = ["#662113", "#662113", "#662113", "#60352A", "#000000"];

//let skintones : any = ["#ffe0c4", "#e2b98f", "#dfa675", "#d79e84", "#5b0000"];
// rebuild skintones as color instances
for (let i = 0; i < skinTones.length; i++) {
    skinTones[i] = m.Color.hexToRgb(skinTones[i]);
    eyeTones[i] = m.Color.hexToRgb(eyeTones[i]);
    featureTones[i] = m.Color.hexToRgb(featureTones[i]);
}
class Feature extends m.Actor
{
    getPushVector()
    : Vector
    {
        let pushVector = m.Mouse.position.copy().subtract(this.position);
        let pushPower = 1/Math.pow(pushVector.length(), 2.2);
        pushVector.multiply(-pushPower*0.0001);
        return pushVector;
    }
    update()
    {
        this.velocity.add(this.getPushVector()).multiply(0.9);
    }
}
class Eye extends m.Actor
{
    pushDrag : number;
    begin(left)
    {
        this.drawing
            .setColor(Color.white)
            .addRect(0.02, 0.02, 0.03)
            .addArc(45, 8)
            .setColor(eyeTones[currentTone])
            .addRect(0.02, 0.02, 0.02)
            .addArc(60, 6)
        this.setPosition(new Vector(left?0.2:0.8, 0.3))
        this.pushDrag = left?0.003:0.001;
    }
    update()
    {
        let pushVector = m.Mouse.position.copy().subtract(this.position).normalize();
        this.velocity.add(pushVector.multiply(this.pushDrag)).multiply(0.9);
    }
}
class Nose extends Feature
{
    begin()
    {
        this.drawing
            .setColor(featureTones[currentTone])
            .addRect(0.05, 0.03, 0.03, -0.01)
            .mirrorX()
            .addRect(0.05)
        this.setPosition(new Vector(0.5, 0.5))
    }    

}
/**
 * just contains a bunch of subsections that make up the mouth
 */
class Mouth extends m.Actor
{
    mouthSections : any;
    begin()
    {
        this.mouthSections = [];
        let nSections = 20;
        for (let i = 0; i < nSections; i++) {

            let ms = new MouthSection();
            this.mouthSections.push(ms);
            
            ms.setPosition(new Vector(i/nSections+0.5/nSections, 0.7));
            ms.originalPosition = ms.position.copy();
        }
    }
    update()
    {
        /**/
        // move the mouth sections up and down
        for (let i = 0; i < this.mouthSections.length; i++) {
            const e = this.mouthSections[i];
            let targetPosition = new Vector(e.originalPosition.x, (Math.sin((g.ticks+i*2)*0.05)+1)*0.5*0.3+0.6);
            e.velocity.add(targetPosition.subtract(e.position).normalize().multiply(0.001))
        }
        
    }
}
class MouthSection extends Feature
{
    lastY = 0;
    originalPosition : Vector;
    begin()
    {
        this.drawing
            .setColor(featureTones[currentTone])
            .addRect(0.04, 0.03)
    }
}
class SaveFace extends m.Game
{
    onBeginGame()
    {
        new Eye(true);
        new Eye(false);
        new Mouth()
        //new Nose();
    }
}

var g : SaveFace;
m.Config.title = "SAVE FACE";
m.Config.saveName = "saveface";
// m.Config.captureConfig.duration = 4;
// m.Config.captureConfig.scale = 0.5;
var currentTone = r.rangeInt(0,skinTones.length-1);
m.Config.backgroundColor = skinTones[currentTone];
m.Game.runOnReady(()=>{
    g = new SaveFace();
});
