// https://developer.mozilla.org/fr/docs/Web/JavaScript/Introduction_%C3%A0_JavaScript_orient%C3%A9_objet
// a chaque bloc de commentaires, vous devez ajouter du code :p
var Cell = function (y, x, image) {
    this.x = x;
    this.y = y;
    this.image = image;
    // crée un élément img et l'insère dans le DOM aux coordonnées x et y
    if (image != "null" && image != "invisible") {
        this.oImg = new Image();
        this.oImg.src = this.image;
        this.oImg.style.position = 'absolute';
        this.oImg.style.width = "30px";
        this.oImg.className = "bloc";
        document.getElementById("map").appendChild(this.oImg);
    }
    this.update = function () {
        // met à jour la position de la cellule dans le DOM
        this.oImg.style.top = this.y * 30 + 'px';
        this.oImg.style.left = this.x * 30 + 'px';
        this.oImg.style.transition = "0.19s"
    };
    this.checkCollision = function (cell, direct) {
        // retourne true si la cellule est aux même coordonnées que cell
        if (direct === "droite") {
            if (map.map[cell.x + 1][cell.y].image == "null") {
                return true;
            }
            else
                return false
        }
        if (direct === "gauche") {
            if (map.map[cell.x - 1][cell.y].image == "null") {
                return true;
            }
            else
                return false
        }
        if (direct === "down") {
            if (map.map[cell.x][cell.y + 1].image == "null") {
                return true;
            }
            else
                return false
        }
        if (direct === "up") {
            if (map.map[cell.x][cell.y - 1].image == "null") {
                return true;
            }
            else
                return false
        }
    };
    this.die = function () {
        // détruit l'objet et le remove de la map
    };
    if (image != "null" && image != "invisible") {
        this.update()
    }
};

var Mario = function (y, x, image) {
    // Mario hérite de Cell
    Cell.call(this, y, x, image);
    this.falling = false;
    this.input = new Input(['ArrowLeft', 'ArrowRight', 'Space']);
    this.jump = {
        power: 0, // hauteur du saut en nombre de cellules
        interval: null // identifiant de l'intervalle de temps entre chaque animations du saut
    };
    this.makeJump = function () {
        // mario monte d'une case s'il le peut et s'il lui reste du power
        // s'il ne le peut pas, il met fin à l'intervalle de temps entre chaque animation du saut
        // mario met à jour le dom à chaque animation de saut
        // si mario saute dans un koopa, mario meurt
        if (mario.checkCollision(mario, "up") && this.jump.power > 0) {

            this.jump.power--

            map.map[mario.x][mario.y - 1] = map.map[mario.x][mario.y];
            map.map[mario.x][mario.y] = new Cell(i, j, "null");

            this.y--
        }
    };
    this.fall = function () {
        // mario se déplace d'une cellule vers le bas s'il le peut et met falling à true
        //if (map.map[mario.x][mario.y+1].)
        if (mario.checkCollision(mario, "down") && mario.jump.power === 0) {
            map.map[mario.x][mario.y + 1] = map.map[mario.x][mario.y];
            map.map[mario.x][mario.y] = new Cell(i, j, "null");
            this.y++;
        }
        // si mario tombe sur un koopa, le koopa meurt
    };
    this.die = function () {
        // mario met fin à son intervalle d'animations

        // mario est retiré de la map
    };
    this.move = function () {
        // si l'Input est flèche de gauche, mario se déplace à gauche s'il le peut

        if (mario.checkCollision(mario, "gauche") && this.input.keys.key == "ArrowLeft") {
            this.jump.power = 0
            map.map[mario.x - 1][mario.y] = map.map[mario.x][mario.y]
            map.map[mario.x][mario.y] = new Cell(i, j, "null")
            this.x--
            this.oImg.src = "asset/image/mario2.png"
            this.input.keys.key = null
        }
        // si l'Input est flèche de droite, mario se déplace à droite s'il le peut
        else if (mario.checkCollision(mario, "droite") && this.input.keys.key == "ArrowRight") {
            map.map[mario.x + 1][mario.y] = map.map[mario.x][mario.y]
            map.map[mario.x][mario.y] = new Cell(i, j, "null")
            this.x++
            this.oImg.src = "asset/image/mario.png"
            this.input.keys.key = null
        }
        // si l'Input est espace, mario commence un saut
        else if (mario.checkCollision(mario, "up") && this.input.keys.key == "Space" && !mario.checkCollision(mario, "down")) {
            this.jump.power = 4
            this.input.keys.key = null
        }
        else if (!mario.checkCollision(mario, "up")) {
            this.jump.power = 0
        }
        // si mario rencontre un koopa après son déplacement, il meurt
    };
    var mario = this;
    this.interval = setInterval(function () {
        mario.makeJump();
        mario.fall();
        mario.move();
        mario.update();
    }, 100);
};

var Koopa = function (y, x, image) {
    // Koopa hérite de Cell
    Cell.call(this, y, x, image);
    var koopa = this;
    this.direction = 'gauche';
    this.die = function () {
        // koopa met fin à son intervalle d'animations
        // koopa est retiré de la map
    };
    this.move = function () {
        // koopa se déplace en direction de direction s'il le peut
        // sinon il change de direction
        if (this.direction == "gauche") {
            if (koopa.checkCollision(koopa, "gauche")) {
                map.map[koopa.x - 1][koopa.y] = map.map[koopa.x][koopa.y];
                map.map[koopa.x][koopa.y] = new Cell(i, j, "null");
                this.x = this.x - 1;
                this.oImg.src = "asset/image/koopa.png"
            }
            else {
                this.direction = "droite"
            }
        }
        else if (this.direction == "droite") {

            if (koopa.checkCollision(koopa, "droite")) {
                map.map[koopa.x + 1][koopa.y] = map.map[koopa.x][koopa.y];
                map.map[koopa.x][koopa.y] = new Cell(i, j, "null");
                this.x = this.x + 1;
                this.oImg.src = "asset/image/koopa2.png"
            }
            else {
                this.direction = "gauche"
            }
        }
        // si koopa recontre mario, mario meurt
    };
    this.fall = function () {
        // koopa se déplace d'une cellule vers le bas s'il le peut*
        if (koopa.checkCollision(koopa, "down")) {
            map.map[koopa.x][koopa.y + 1] = map.map[koopa.x][koopa.y];
            map.map[koopa.x][koopa.y] = new Cell(i, j, "null");
            this.y = this.y + 1;
        }
    };
    this.update = function () {
        // met à jour la position de la cellule dans le DOM
        this.oImg.style.top = this.y * 30 + 'px';
        this.oImg.style.left = this.x * 30 + 'px';
        this.oImg.style.transition = "0.5s"
    };
    this.interval = setInterval(function () {
        koopa.fall();
        koopa.move();
        koopa.update();
    }, 200);
}
var bowser = function (y, x, img) {
    Cell.call(this, y, x, img)
    var bowser = this;
    this.oImg.style.top = (this.y * 30 - 15) + "px"

    this.direction = 'gauche';
    this.die = function () {
        // bowser met fin Ã  son intervalle d'animations
        // bowser est retirÃ© de la map
    };
    this.move = function () {
        if (this.direction === "gauche") {
            if (bowser.checkCollision(bowser, "gauche")) {
                this.x = this.x - 1;
            }
            else {
                this.direction = "droite"
            }
        }
        else if (this.direction === "droite") {
            if (bowser.checkCollision(bowser, "droite")) {
                this.x = this.x + 1;
                //this.x %2 == 0
                //this.x--
            }
            else {
                this.direction = "gauche"
            }
        }
    };
    this.fall = function () {
        // bowser se dÃ©place d'une cellule vers le bas s'il le peut
        if (bowser.checkCollision(bowser, "down")) {
            map.map[bowser.x][bowser.y + 1] = map.map[bowser.x][bowser.y];
            map.map[bowser.x][bowser.y] = new Cell(i, j, "null");
            this.y = this.y + 1;
        }
    };
    this.update = function () {
        // met Ã  jour la position de la cellule dans le DOM
        this.oImg.style.top = this.y * 30 + 'px';
        this.oImg.style.left = this.x * 30 + 'px';
        this.oImg.style.top = (this.y * 30 - 15) + "px"
    };

    this.interval = setInterval(function () {
        bowser.fall();
        //bowser.move();
        bowser.update();
    }, 200);
}
var peach = function (y, x, img) {
    Cell.call(this, y, x, img)
    this.oImg.style.top = (this.y * 30 - 13) + "px"
}
var Input = function (keys) {
    this.keys = {};
    // Input récupère les touches actives du clavier
    input = this;
    document.body.addEventListener('keydown', function (event) {
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == event.code) {
                input.keys = {"key": event.code}
            }
        }
    });
}

var Map = function (model) {
    this.map = [];
    this.grille = {};
    this.generateMap = function () {
        // créé une map qui soit le reflet du model composés d'objets avec x, y, et l'instance correspondante
        // instancie les classes correspondants au schema
        // avec :
        //      w => Cell
        //      k => Koopa
        //      m => Mario
        for (i = 0; i < model.length; i++) {
            for (j = 0; j < model[i].length; j++) {

                if (typeof this.map[j] == "undefined") {
                    this.map[j] = [];
                }
                if (model[i][j] === " ") {
                    this.map[j].push(new Cell(i, j, "null"));
                }
                else if (model[i][j] === "k") {
                    this.map[j].push(new Koopa(i, j, "asset/image/koopa.png"));
                }
                else if (model[i][j] === "m") {
                    this.map[j].push(new Mario(i, j, "asset/image/mario.png"));
                }
                else if (model[i][j] === "b") {
                    this.map[j].push(new bowser(i, j, "asset/image/bowser.png"));
                }
                else if (model[i][j] === "p") {
                    this.map[j].push(new peach(i, j, "asset/image/peach.png"));
                }
                else if (model[i][j] === "i") {
                    this.map[j].push(new Cell(i, j, "invisible"))
                }
                else if (model[i][j] === "w") {
                    this.map[j].push(new Cell(i, j, "asset/image/wall.png"));
                }

                this.gille = {"x": i * 30, "y": j * 30}
            }
        }
        document.getElementById('map').style.width = this.gille.y + 'px'
        document.getElementById('map').style.height = this.gille.x + 'px'
    };
};
this.checkCollision = function (cell) {
    // parcourt la map et renvoie la cellule aux mêmes coordonnées que cell
};
this.delete = function (cell) {
    // retire la cell de map
    // retire la cell du dom
    // delete la cell
};

var schema = [
    'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',
    'i   p            b               k                               i',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww  w   w                      i',
    'i                                         ww                   w i',
    'i                                        www                  ww i',
    'i         wwwwwwwwwwwwwwww   w    wwwwwwwwww             k   www i',
    'i                            ww                       wwwwwwwwww i',
    'i                            www                   w             i',
    'i            k    w          wwwwwwww             ww             i',
    'wwwwwwwwwwwwwwwwwww                         wwwwwwww             i',
    'i                      w           k   w                         i',
    'i              wwwww  wwwwwwwwwwwwwwwwwwww                       i',
    'i             ww                                                 i',
    'i            www                                                 i',
    'i           wwww                          ww                     i',
    'i          wwwww                         www                     i',
    'i   m     wwwwww    k  w      k         wwww                    ii',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwi',
];
var map = new Map(schema);
map.generateMap();