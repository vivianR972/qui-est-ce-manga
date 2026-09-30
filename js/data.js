window.QEC=window.QEC||{};
QEC.MANGAS=[
{id:"mix",name:"Tous les mangas",icon:"\u2726"},
{id:"naruto",name:"Naruto",icon:"\uD83C\uDF67"},
{id:"onepiece",name:"One Piece",icon:"\u2620"},
{id:"dbz",name:"Dragon Ball",icon:"\u2605"},
{id:"demonslayer",name:"Demon Slayer",icon:"\u2694"},
{id:"jujutsu",name:"Jujutsu Kaisen",icon:"\u773C"},
{id:"snk",name:"L'Attaque des Titans",icon:"\uD83E\uDDF1"},
{id:"mha",name:"My Hero Academia",icon:"\u2605"},
{id:"deathnote",name:"Death Note",icon:"\uD83D\uDCD3"},
{id:"hxh",name:"Hunter x Hunter",icon:"\u25C8"},
{id:"bleach",name:"Bleach",icon:"\u271D"},
{id:"fma",name:"Fullmetal Alchemist",icon:"\u2697"},
{id:"opm",name:"One Punch Man",icon:"\uD83D\uDC4A"},
{id:"csm",name:"Chainsaw Man",icon:"\u26D3"}
];
QEC.MIX_IDS=["naruto","sasuke","sakura","kakashi","luffy","zoro","nami","sanji","goku","vegeta","piccolo","tanjiro","nezuko","zenitsu","yuji","gojo","eren","mikasa","levi","deku","bakugo","todoroki","light","l","gon","killua","ichigo","rukia","edward","saitama","denji","power"];
QEC.QUESTIONS=[
{id:"sexe-f",label:"Est-ce une femme ?",test:function(c){return c.sexe==="F";}},
{id:"sexe-h",label:"Est-ce un homme ?",test:function(c){return c.sexe==="H";}},
{id:"cheveux-clair",label:"Cheveux clairs ?",test:function(c){return ["blond","blanc","gris","jaune"].indexOf(c.cheveux)>=0;}},
{id:"cheveux-fonce",label:"Cheveux fonces ?",test:function(c){return ["noir","brun"].indexOf(c.cheveux)>=0;}},
{id:"long",label:"Cheveux longs ?",test:function(c){return ["long","double","queue","tresse"].indexOf(c.longueur)>=0;}},
{id:"lunettes",label:"Lunettes ?",test:function(c){return !!c.lunettes;}},
{id:"masque",label:"Masque ?",test:function(c){return c.accessoire==="masque";}},
{id:"vilain",label:"Vilain ?",test:function(c){return c.role==="vilain";}},
{id:"heros",label:"Heros ?",test:function(c){return c.role==="heros";}},
{id:"adulte",label:"Adulte ?",test:function(c){return c.age==="adulte";}}
];
QEC.mangaName=function(id){var m=QEC.MANGAS.filter(function(x){return x.id===id;})[0];return m?m.name:id;};
QEC.pool=function(mode){if(!QEC.CHARS)return[];if(mode==="mix"){var set={};QEC.MIX_IDS.forEach(function(id){set[id]=1;});return QEC.CHARS.filter(function(c){return set[c.id];});}return QEC.CHARS.filter(function(c){return c.manga===mode;});};
