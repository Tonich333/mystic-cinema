(function(){
if(window.mysticLoaded)return;
window.mysticLoaded=true;

var s=document.createElement('style');
s.innerHTML='.mw{padding:20px;background:#0d0d1a;min-height:100%}.mt{color:#b388ff;font-size:26px;margin-bottom:20px}.mg{display:flex;flex-wrap:wrap;gap:15px}.mc{width:150px;background:#1a1a2e;border-radius:8px;overflow:hidden;cursor:pointer;border:2px solid transparent}.mc:hover{border-color:#b388ff}.mc img{width:100%;height:220px;object-fit:cover}.mct{color:#fff;font-size:12px;padding:5px}.mcy{color:#aaa;font-size:11px;padding:0 5px}.mcr{color:gold;font-size:12px;padding:5px}.ml{color:#b388ff;font-size:22px;text-align:center;padding:60px}';
document.head.appendChild(s);

Lampa.Component.add('mystic_screen',function(){
var self=this;
this.create=function(){
var w=document.createElement('div');
w.className='mw';
var l=document.createElement('div');
l.className='ml';
l.textContent='Загружаем мистику...';
w.appendChild(l);
self.html=$(w);
loadMovies();
return self.html;
};
this.start=function(){};
this.pause=function(){};
this.stop=function(){};
this.destroy=function(){if(self.html)self.html.remove();};
this.back=function(){Lampa.Activity.back();};
});

// Ждём пока меню появится в DOM
var menuInterval=setInterval(function(){
var menu=$('.menu__list');
if(menu.length && !$('.mystic-btn').length){
var li=document.createElement('li');
li.className='mystic-btn';
var a=document.createElement('a');
a.textContent='Мистика';
li.appendChild(a);
$(li).on('click',function(){
Lampa.Activity.push({
component:'mystic_screen',
title:'Мистика с 50-х'
});
});
menu.append(li);
console.log('Кнопка Мистика добавлена!');
clearInterval(menuInterval);
}
},100);

function loadMovies(){
var url=Lampa.TMDB.api('discover/movie',{
with_genres:'27,9648',
'primary_release_date.gte':'1950-01-01',
'vote_average.gte':'7',
'vote_count.gte':'200',
sort_by:'vote_average.desc',
language:'ru-RU',
page:1
});
$.ajax({
url:url,
success:function(data){showMovies(data.results);},
error:function(){
var d=document.querySelector('.mw');
if(d)d.textContent='Ошибка загрузки';
}
});
}

function showMovies(movies){
var c=document.querySelector('.mw');
if(!c)return;
c.innerHTML='';
var t=document.createElement('div');
t.className='mt';
t.textContent='Мистика с 50-х годов';
c.appendChild(t);
var g=document.createElement('div');
g.className='mg';
movies.forEach(function(m){
var poster=m.poster_path?'https://image.tmdb.org/t/p/w300'+m.poster_path:'';
var year=m.release_date?m.release_date.substring(0,4):'--';
var rating=m.vote_average?m.vote_average.toFixed(1):'?';
var card=document.createElement('div');
card.className='mc selector';
var img=document.createElement('img');
img.src=poster;
var ct=document.createElement('div');
ct.className='mct';
ct.textContent=m.title;
var cy=document.createElement('div');
cy.className='mcy';
cy.textContent=year;
var cr=document.createElement('div');
cr.className='mcr';
cr.textContent=rating;
card.appendChild(img);
card.appendChild(ct);
card.appendChild(cy);
card.appendChild(cr);
$(card).on('click',function(){
Lampa.Activity.push({
url:Lampa.TMDB.api('movie/'+m.id),
component:'full',
id:m.id,
method:'movie',
media_type:'movie',
title:m.title
});
});
g.appendChild(card);
});
c.appendChild(g);
}

console.log('Плагин Мистика готов!');

})();

