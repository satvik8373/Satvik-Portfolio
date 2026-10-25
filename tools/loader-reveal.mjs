// Change the logo artwork while retaining the reference loader's dimensions,
// path roles, draw/bounce sequence, centering, timing and exit wipes.
export function personalizeLoader($,font,pathData){
 const svg=$('.loader-inner svg').first();
 const paths=svg.find('path');
 if(paths.length!==6)throw new Error('Expected the original six-path loader');
 function glyph(letter,x,y,width,height){
  const p=font.getPath(letter,0,0,100);
  const bounds=p.getBoundingBox();
  const sx=width/(bounds.x2-bounds.x1),sy=height/(bounds.y2-bounds.y1);
  for(const command of p.commands){
   for(const key of ['x','x1','x2'])if(key in command)command[key]=x+(command[key]-bounds.x1)*sx;
   for(const key of ['y','y1','y2'])if(key in command)command[key]=y+(command[key]-bounds.y1)*sy;
  }
  return pathData(p);
 }
 // A keeps the reference handwritten stroke role. The other five glyphs form
 // one SATVIK row; shifting the entire group centers the wider personal name.
 const strokeA='M660.002 583.81L715 464Q725.502 441 736 464L791.002 583.81L771 540H682';
 const oldStroke=paths.eq(3).attr('d');
 const oldRibbon=paths.eq(0).attr('d');
 if(!oldRibbon.includes(oldStroke.slice(1)))throw new Error('Reference ribbon does not contain its central letter');
 paths.eq(0).attr({'data-loader-ribbon':'',d:oldRibbon.replace(oldStroke.slice(1),strokeA.slice(1))});
 paths.eq(1).attr({d:glyph('V',944.156,453.984,108,139.744),'data-loader-letter':'V'});
 paths.eq(2).attr({d:glyph('I',1072.156,453.984,17,139.744),'data-loader-letter':'I'});
 paths.eq(3).attr({d:strokeA,'data-loader-letter':'A',fill:'none'});
 paths.eq(4).attr({d:glyph('S',544.502,453.984,93.421,139.744),'data-loader-letter':'S'});
 paths.eq(5).attr({d:glyph('T',811.277,455.623,112.879,136.464),'data-loader-letter':'T'});
 svg.append(`<path d="${glyph('K',1109.156,453.984,102,139.744)}" fill="#FF5400" data-loader-letter="K"/>`);
 const center=(544.502+1211.156)/2;
 svg.find('path').wrapAll(`<g transform="translate(${1451/2-center} 0)"/>`);
 svg.attr({role:'img','aria-label':'Satvik Patel',viewBox:'0 0 1451 1004'});
 svg.append('<title>Satvik Patel</title>');
}
