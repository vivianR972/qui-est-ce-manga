window.QEC=window.QEC||{};
QEC.MANGAS=[
{id:"mix",name:"Tous les mangas",icon:"*"},
{id:"naruto",name:"Naruto",icon:"N"},
{id:"onepiece",name:"One Piece",icon:"P"},
{id:"dbz",name:"Dragon Ball",icon:"D"},
{id:"demonslayer",name:"Demon Slayer",icon:"S"},
{id:"jujutsu",name:"Jujutsu Kaisen",icon:"J"},
{id:"snk",name:"L Attaque des Titans",icon:"T"},
{id:"mha",name:"My Hero Academia",icon:"H"},
{id:"deathnote",name:"Death Note",icon:"K"},
{id:"hxh",name:"Hunter x Hunter",icon:"X"},
{id:"bleach",name:"Bleach",icon:"B"},
{id:"fma",name:"Fullmetal Alchemist",icon:"F"},
{id:"opm",name:"One Punch Man",icon:"O"},
{id:"csm",name:"Chainsaw Man",icon:"C"}
];
QEC.MIX_IDS=["naruto","sasuke","sakura","kakashi","luffy","zoro","nami","sanji","goku","vegeta","piccolo","tanjiro","nezuko","zenitsu","yuji","gojo","eren","mikasa","levi","deku","bakugo","todoroki","light","l","gon","killua","ichigo","rukia","edward","saitama","denji","power"];
QEC.QUESTIONS=[
{id:"sexe-f",label:"Est-ce une femme ?",test:function(c){return c.sexe==="F";}},
{id:"sexe-h",label:"Est-ce un homme ?",test:function(c){return c.sexe==="H";}},
{id:"cheveux-clair",label:"A-t-il les cheveux clairs ?",test:function(c){return ["blond","blanc","gris","jaune"].indexOf(c.cheveux)>=0;}},
{id:"cheveux-fonce",label:"A-t-il les cheveux fonces ?",test:function(c){return ["noir","brun"].indexOf(c.cheveux)>=0;}},
{id:"cheveux-colore",label:"A-t-il les cheveux colores ?",test:function(c){return ["rose","bleu","vert","violet","rouge","orange","roux"].indexOf(c.cheveux)>=0;}},
{id:"long",label:"A-t-il les cheveux longs ?",test:function(c){return ["long","double","queue","tresse"].indexOf(c.longueur)>=0;}},
{id:"court",label:"A-t-il les cheveux courts ?",test:function(c){return c.longueur==="court"||c.longueur==="moyen";}},
{id:"chauve",label:"Est-il chauve ?",test:function(c){return c.longueur==="chauve"||c.cheveux==="chauve";}},
{id:"lunettes",label:"Porte-t-il des lunettes ?",test:function(c){return !!c.lunettes;}},
{id:"masque",label:"Porte-t-il un masque ?",test:function(c){return c.accessoire==="masque";}},
{id:"chapeau",label:"Porte-t-il un chapeau ?",test:function(c){return c.accessoire==="chapeau";}},
{id:"bandeau",label:"Porte-t-il un bandeau ?",test:function(c){return c.accessoire==="bandeau";}},
{id:"cicatrice",label:"A-t-il une cicatrice ?",test:function(c){return !!c.cicatrice;}},
{id:"enfant",label:"Est-ce un enfant ?",test:function(c){return c.age==="enfant";}},
{id:"ado",label:"Est-ce un adolescent ?",test:function(c){return c.age==="ado";}},
{id:"adulte",label:"Est-ce un adulte ?",test:function(c){return c.age==="adulte";}},
{id:"heros",label:"Est-ce un heros ?",test:function(c){return c.role==="heros";}},
{id:"vilain",label:"Est-ce un vilain ?",test:function(c){return c.role==="vilain";}},
{id:"anti",label:"Est-ce un anti-heros ?",test:function(c){return c.role==="antiheros";}}
];
QEC.mangaName=function(id){var m=QEC.MANGAS.filter(function(x){return x.id===id;})[0];return m?m.name:id;};
QEC.pool=function(mode){if(!QEC.CHARS)return[];if(mode==="mix"){var set={};QEC.MIX_IDS.forEach(function(id){set[id]=1;});return QEC.CHARS.filter(function(c){return set[c.id];});}return QEC.CHARS.filter(function(c){return c.manga===mode;});};
