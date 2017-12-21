import { Pipe, PipeTransform } from '@angular/core';
import { beforeUrl, China, pageAnimation, tagAnimation, TreeNode } from './public-data';

/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'exponentialStrength'})
export class FuzzySearchPipe implements PipeTransform {
nodelist =new Array<any>()

  transform(objects: Array<any>, value: string) {
    this.nodelist = []
   return  this.traverse(objects,value)
  }
  traverse(e: any[], file:any ) {
    for (let i = 0; i < e.length; i++) {
      if ( e[i].label.indexOf(file)>-1 ){
        this.nodelist.push(e[i])
      }
        if (e[i].chilren.length > 0) {
            this.traverse(e[i].chilren, file[i].children)
        } else {
            break
        }
    }
    return this.nodelist 
}

}