(function(){
  QEC.CHARS=QEC.CHARS||[];
  function load(t){
    var lines=t.split("\n");
    for(var i=0;i<lines.length;i++){
      var p=lines[i].split("|");
      if(p.length<10) continue;
      QEC.CHARS.push({id:p[0],name:p[1],manga:p[2],sexe:p[3],cheveux:p[4],longueur:p[5],yeux:p[6],lunettes:p[7]==="1",accessoire:p[8],role:p[9],espece:p[10],age:p[11],cicatrice:p[12]==="1",color:p[13]});
    }
  }
  load(`jiraiya|Jiraiya|naruto|H|blanc|long|noir|0|aucun|soutien|ninja|adulte|0|#d9d3c5
orochimaru|Orochimaru|naruto|H|noir|long|jaune|0|aucun|vilain|ninja|adulte|0|#4a6b4a
tsunade|Tsunade|naruto|F|blond|long|brun|0|aucun|soutien|ninja|adulte|0|#d4a017
shikamaru|Shikamaru Nara|naruto|H|noir|long|noir|0|aucun|heros|ninja|ado|0|#3d3a32
rocklee|Rock Lee|naruto|H|noir|long|noir|0|bandeau|heros|ninja|ado|0|#1f6b3a
neji|Neji Hyuga|naruto|H|brun|long|blanc|0|bandeau|heros|ninja|ado|0|#6b4f32
madara|Madara Uchiha|naruto|H|noir|long|rouge|0|aucun|vilain|ninja|adulte|0|#1a1a22
minato|Minato Namikaze|naruto|H|blond|court|bleu|0|bandeau|heros|ninja|adulte|0|#f0c14a
obito|Obito Uchiha|naruto|H|noir|court|noir|0|masque|vilain|ninja|adulte|1|#2c3e50
sai|Sai|naruto|H|noir|court|noir|0|aucun|heros|ninja|ado|0|#2d2d2d
ino|Ino Yamanaka|naruto|F|blond|long|bleu|0|aucun|heros|ninja|ado|0|#e8c547
konan|Konan|naruto|F|bleu|court|orange|0|aucun|vilain|ninja|adulte|0|#5dade2
usopp|Usopp|onepiece|H|noir|frise|noir|0|aucun|heros|pirate|adulte|0|#8e5a2b
franky|Franky|onepiece|H|bleu|herisse|noir|1|lunettes|heros|pirate|adulte|0|#2980b9
brook|Brook|onepiece|H|noir|afro|noir|0|chapeau|heros|pirate|adulte|0|#ecf0f1
jinbe|Jinbe|onepiece|H|noir|court|noir|0|aucun|heros|pirate|adulte|0|#1abc9c
shanks|Shanks|onepiece|H|roux|moyen|noir|0|cape|heros|pirate|adulte|1|#922b21
hancock|Boa Hancock|onepiece|F|noir|long|noir|0|aucun|antiheros|pirate|adulte|0|#6c3483
doflamingo|Doflamingo|onepiece|H|blond|long|rouge|1|lunettes|vilain|pirate|adulte|0|#f4d03f
crocodile|Crocodile|onepiece|H|noir|court|noir|0|aucun|vilain|pirate|adulte|1|#7d6608
yamato|Yamato|onepiece|F|blanc|long|noir|0|aucun|heros|pirate|adulte|0|#d5d8dc
sabo|Sabo|onepiece|H|blond|court|noir|0|chapeau|heros|pirate|adulte|1|#c0392b
bigmom|Big Mom|onepiece|F|rose|long|rose|0|aucun|vilain|pirate|adulte|0|#e8daef
kaido|Kaido|onepiece|H|noir|long|rouge|0|cornes|vilain|pirate|adulte|0|#1a5276
trunks|Trunks|dbz|H|violet|long|bleu|0|epee|heros|saiyan|ado|0|#7d3c98
c18|C-18|dbz|F|blond|court|bleu|0|aucun|antiheros|alien|adulte|0|#f7dc6f
cell|Cell|dbz|H|vert|court|rose|0|aucun|vilain|alien|adulte|0|#1e8449
boo|Majin Boo|dbz|H|rose|court|rouge|0|aucun|vilain|alien|adulte|0|#f5b7b1
broly|Broly|dbz|H|vert|long|noir|0|aucun|vilain|saiyan|adulte|0|#196f3d
whis|Whis|dbz|H|blanc|long|violet|0|aucun|soutien|alien|adulte|0|#d2b4de
chichi|Chichi|dbz|F|noir|long|noir|0|aucun|soutien|humain|adulte|0|#1c2833
jiren|Jiren|dbz|H|gris|court|rouge|0|aucun|antiheros|alien|adulte|0|#7b241c
yamcha|Yamcha|dbz|H|noir|long|noir|0|aucun|heros|humain|adulte|1|#6e2c00
tien|Ten Shinhan|dbz|H|chauve|chauve|noir|0|aucun|heros|humain|adulte|0|#2c3e50
goten|Goten|dbz|H|noir|herisse|noir|0|aucun|heros|saiyan|enfant|0|#f39c12
videl|Videl|dbz|F|noir|court|noir|0|aucun|heros|humain|adulte|0|#1a1a2e
tengen|Tengen Uzui|demonslayer|H|blanc|court|rouge|0|bijoux|heros|humain|adulte|0|#f4f6f7
mitsuri|Mitsuri Kanroji|demonslayer|F|rose|long|vert|0|aucun|heros|humain|adulte|0|#f5b7b1
muichiro|Muichiro Tokito|demonslayer|H|noir|court|vert|0|aucun|heros|humain|ado|0|#a9cce3
sanemi|Sanemi|demonslayer|H|blanc|herisse|violet|0|aucun|heros|humain|adulte|1|#eaecee
gyomei|Gyomei|demonslayer|H|noir|court|blanc|0|aucun|heros|humain|adulte|1|#1c2833
akaza|Akaza|demonslayer|H|rose|court|jaune|0|aucun|vilain|demon|adulte|0|#c39bd3
daki|Daki|demonslayer|F|noir|long|rose|0|aucun|vilain|demon|ado|0|#6c3483
kanao|Kanao Tsuyuri|demonslayer|F|noir|long|violet|0|aucun|heros|humain|ado|0|#5b2c6f
yuta|Yuta Okkotsu|jujutsu|H|noir|court|bleu|0|aucun|heros|sorcier|ado|0|#1c2833
maki|Maki Zenin|jujutsu|F|vert|long|or|1|lunettes|heros|humain|ado|1|#1e8449
inumaki|Toge Inumaki|jujutsu|H|blanc|court|violet|0|masque|heros|sorcier|ado|0|#d5d8dc
panda|Panda|jujutsu|H|blanc|court|noir|0|aucun|heros|alien|ado|0|#f4f6f7
mahito|Mahito|jujutsu|H|gris|court|gris|0|aucun|vilain|demon|adulte|0|#7f8c8d
jogo|Jogo|jujutsu|H|chauve|chauve|rouge|0|aucun|vilain|demon|adulte|0|#c0392b
kenjaku|Kenjaku|jujutsu|H|noir|long|marron|0|aucun|vilain|demon|adulte|1|#17202a
choso|Choso|jujutsu|H|noir|long|rouge|0|aucun|antiheros|demon|adulte|0|#7b241c`);
  load(`sasha|Sasha Braus|snk|F|brun|court|brun|0|aucun|heros|humain|ado|0|#6e2c00
jean|Jean Kirstein|snk|H|brun|court|brun|0|aucun|heros|humain|ado|0|#9a7d0a
connie|Connie Springer|snk|H|chauve|chauve|brun|0|aucun|heros|humain|ado|0|#f5cba7
hange|Hange Zoe|snk|F|brun|long|brun|1|lunettes|soutien|humain|adulte|0|#5d4037
zeke|Zeke Jager|snk|H|blond|court|bleu|1|lunettes|vilain|titan|adulte|0|#f7dc6f
bertholdt|Bertholdt|snk|H|noir|court|vert|0|aucun|vilain|titan|adulte|0|#1c2833
pieck|Pieck Finger|snk|F|noir|long|noir|0|aucun|antiheros|titan|adulte|0|#2c3e50
aizawa|Aizawa|mha|H|noir|long|noir|0|bandeau|soutien|heros|adulte|0|#1c2833
endeavor|Endeavor|mha|H|rouge|herisse|turquoise|0|aucun|heros|heros|adulte|1|#c0392b
hawks|Hawks|mha|H|blond|court|or|0|aucun|heros|heros|adulte|0|#ca6f1e
iida|Tenya Iida|mha|H|bleu|court|rouge|1|lunettes|heros|heros|ado|0|#1a5276
yaoyorozu|Momo Yaoyorozu|mha|F|noir|long|noir|0|aucun|heros|heros|ado|0|#1a1a2e
tokoyami|Tokoyami|mha|H|noir|court|rouge|0|aucun|heros|heros|ado|0|#17202a
twice|Twice|mha|H|gris|court|marron|0|masque|vilain|vilain|adulte|0|#7f8c8d
mirio|Mirio Togata|mha|H|blond|court|bleu|0|aucun|heros|heros|ado|0|#f4d03f
eri|Eri|mha|F|gris|long|rouge|0|corne|soutien|humain|enfant|0|#d5d8dc
watari|Watari|deathnote|H|blanc|court|gris|1|lunettes|soutien|humain|adulte|0|#d5d8dc
matsuda|Matsuda|deathnote|H|noir|court|brun|0|aucun|soutien|humain|adulte|0|#6e2c00
mikami|Teru Mikami|deathnote|H|noir|court|brun|1|lunettes|vilain|humain|adulte|0|#1c2833
takada|Kiyomi Takada|deathnote|F|noir|long|brun|0|aucun|antiheros|humain|adulte|0|#1c2833
sayu|Sayu Yagami|deathnote|F|brun|long|brun|0|aucun|soutien|humain|ado|0|#f5b7b1
bisky|Biscuit Krueger|hxh|F|blond|long|bleu|0|aucun|heros|chasseur|adulte|0|#f9e79f
illumi|Illumi Zoldyck|hxh|H|noir|long|noir|0|aucun|vilain|chasseur|adulte|0|#1a1a2e
feitan|Feitan|hxh|H|noir|court|gris|0|aucun|vilain|chasseur|adulte|0|#2c3e50
pitou|Neferpitou|hxh|F|blanc|court|or|0|cornes|vilain|alien|adulte|0|#f5cba7
kite|Kite|hxh|H|blanc|court|gris|0|aucun|soutien|chasseur|adulte|0|#d5d8dc
ging|Ging Freecss|hxh|H|noir|court|brun|0|aucun|antiheros|chasseur|adulte|0|#6e2c00
uryu|Uryu Ishida|bleach|H|noir|court|bleu|1|lunettes|heros|humain|ado|0|#1a5276
chad|Yasutora Sado|bleach|H|noir|court|brun|0|aucun|heros|humain|ado|0|#6e2c00
gin|Gin Ichimaru|bleach|H|blanc|court|bleu|0|aucun|vilain|shinigami|adulte|0|#eaecee
renji|Renji Abarai|bleach|H|roux|long|brun|0|aucun|heros|shinigami|adulte|1|#922b21
ulquiorra|Ulquiorra|bleach|H|noir|court|vert|0|aucun|vilain|demon|adulte|0|#117a65
grimmjow|Grimmjow|bleach|H|bleu|herisse|bleu|0|aucun|vilain|demon|adulte|0|#5dade2
hawkeye|Riza Hawkeye|fma|F|blond|court|brun|0|aucun|soutien|humain|adulte|0|#f5cba7
scar|Scar|fma|H|chauve|chauve|noir|0|aucun|antiheros|humain|adulte|1|#2c3e50
lust|Lust|fma|F|noir|long|rouge|0|aucun|vilain|demon|adulte|0|#7b241c
armstrong|Armstrong|fma|H|blond|court|bleu|0|aucun|heros|alchimiste|adulte|0|#f7dc6f
atomic|Atomic Samurai|opm|H|noir|long|noir|0|aucun|heros|heros|adulte|0|#1c2833
metalbat|Metal Bat|opm|H|noir|court|noir|0|aucun|heros|heros|ado|0|#7b241c
flashy|Flashy Flash|opm|H|blond|long|bleu|0|aucun|heros|heros|adulte|0|#f7dc6f
angel|Angel Devil|csm|H|blanc|long|or|0|aucun|antiheros|devil|adulte|0|#f9e79f
himeno|Himeno|csm|F|noir|court|brun|0|aucun|soutien|humain|adulte|0|#2c3e50
kishibe|Kishibe|csm|H|blanc|court|gris|0|aucun|soutien|humain|adulte|1|#d5d8dc
nayuta|Nayuta|csm|F|blond|long|jaune|0|aucun|antiheros|devil|enfant|0|#f4d03f
asa|Asa Mitaka|csm|F|noir|court|brun|0|aucun|heros|humain|ado|0|#2c3e50`);
})();
