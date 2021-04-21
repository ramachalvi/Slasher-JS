var ScenePlay = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize:
    function ScenePlay ()
    {
        Phaser.Scene.call(this, { key: 'sceneplay'});

    },

    preload: function()
    {


    },

    create: function(){
               
function tick() {

    let now = Date.now();
    let dt = now - GameManager.lastUpdated;
    GameManager.lastUpdated = now;
    GameManager.fps = parseInt(1000 / dt);

    $('#divFPS').text('FPS:' + GameManager.fps);

    GameManager.enemies.update(dt);

    if (GameManager.enemies.gameOver == true) {
        console.log('game over');
        showGameOver();
    } else {
        GameManager.bullets.update(dt);
        GameManager.player.update(dt);
        if (GameManager.player.lives <= 0) {
            console.log('game over');
            showGameOver();
        } else if (GameManager.phaser == GameSettings.gamePhaser.playing) {
            setTimeout(tick, GameSettings.targetFPS);
        }
    }

}

function clearTimeouts() {
    for (let i = 0; i < GameManager.timeouts.length; ++i) {
        clearTimeout(GameManager.timeouts[i]);
    }
    GameManager.timeouts = [];
}

function showGameOver() {
    GameManager.phaser = GameSettings.gameOver;

    pauseStars();
    clearTimeouts();

    if (GameManager.enemies.gameOver == true) {
        playSound('completed');
    } else {
        playSound('gameover');
    }

    writeMessage('Game Over');
    setTimeout(function () { appendMessage('Press Space To Reset'); },
        GameSettings.pressSpaceDelay);

}

function endCountDown() {
    clearMessages();
    playSound('go');
    GameManager.phaser = GameSettings.gamePhaser.playing;
    GameManager.lastUpdated = Date.now();
    setTimeout(tick, GameSettings.targetFPS);
}

function setCountDownValue(val) {
    playSound('countdown');
    writeMessage(val);
}

function runCountDown() {
    createStars();
    GameManager.phaser = GameSettings.gamePhaser.countdownToStart;
    writeMessage(3);
    playSound('countdown');
    for (let i = 0; i < GameSettings.countDownValues.length; ++i) {
        setTimeout(setCountDownValue, GameSettings.countdownGap * (i + 1),
            GameSettings.countDownValues[i]);
    }
    setTimeout(endCountDown,
        (GameSettings.countDownValues.length + 1) * GameSettings.countdownGap);
}

function writeMessage(text) {
    clearMessages();
    appendMessage(text);
}

function appendMessage(text) {
    $('#messageContainer').append('<div class="message">' + text + '</div>');
}

function clearMessages() {
    $('#messageContainer').empty();
}

function resetExplosions() {
    GameManager.explosions = new Explosions('Explosion/explosion00_s');
}

function resetBullets() {
    if (GameManager.bullets != undefined) {
        GameManager.bullets.reset();
    } else {
        GameManager.bullets = new BulletCollection(GameManager.player);
    }
}

function resetEnemies() {
    if (GameManager.enemies != undefined) {
        GameManager.enemies.reset();
    } else {
        GameManager.enemies = new EnemyCollection(GameManager.player, 
            GameManager.bullets,
            GameManager.explosions);
    }
}

function resetplayer() {
    console.log('resetplayer()');
    console.log('resetplayer() GameManager.player:', GameManager.player);
    if (GameManager.player == undefined) {
        console.log('resetplayer() making new');
        let asset = GameManager.assets['playerShip1_blue'];

        GameManager.player = new Player('playerSprite',
            new Point(GameSettings.playerStart.x, GameSettings.playerStart.y),
            GameManager.assets['playerShip1_blue'],
            new Rect(40, 40, GameSettings.playAreaWidth - 80, GameSettings.playAreaHeight - 80));
        GameManager.player.addToBoard(true);

        console.log('resetplayer() added new GameManager.player:', GameManager.player);
    }

    console.log('resetplayer() GameManager.player:', GameManager.player);
    GameManager.player.reset();
}

function resetGame() {
    console.log('Main Game init()');
    clearTimeouts();
    removeStars();
    resetplayer();
    resetBullets();
    resetExplosions();
    resetEnemies();

    GameManager.phaser = GameSettings.gamePhaser.readyToplay;
    GameManager.lastUpdated = Date.now();
    GameManager.elapsedTime = 0;

    writeMessage('Press Space To Start');
}


function processAsset(indexNum) {
    let img = new Image();
    let fileName = 'assets/' + ImageFiles[indexNum] + '.png';
    img.src = fileName;
    img.onload = function () {
        GameManager.assets[ImageFiles[indexNum]] = {
            width: this.width,
            height: this.height,
            fileName: fileName
        }
        indexNum++;
        if (indexNum < ImageFiles.length) {
            processAsset(indexNum);
        } else {
            console.log('Assets Done:', GameManager.assets);
            resetGame();
        }
    }
};

var counter = document.querySelector('p');
var count = 0;

setInterval(() => {
    counter.innerText = count;
    count++

    if (count >= 180) location.replace('index.html')
}, 1000)

const ImageFiles = [
    'Enemies/enemyRed1',
    'Enemies/enemyBlue3',
    'Enemies/enemyGreen2',
    'Enemies/enemyBlack4',
    'Enemies/enemyRed5',
    'playerShip1_blue',
    'Lasers/laserBlue02_s',
    'Explosion/explosion00_s',
    'Explosion/explosion01_s',
    'Explosion/explosion02_s',
    'Explosion/explosion03_s',
    'Explosion/explosion04_s',
    'Explosion/explosion05_s',
    'Explosion/explosion06_s',
    'Explosion/explosion07_s',
    'Explosion/explosion08_s'
];

const soundFiles = [
    'countdown',
    'explosion',
    'go',
    'loselife',
    'gameover',
    'completed'
];
const soundPath = 'assets/Sounds/';

const WayPoints = {
    STREAM60: [{
        rotation: 0,
        x: 60,
        y: -90,
        dir_x: 0,
        dir_y: 0
    },
    {
        rotation: 0,
        x: 60,
        y: 620,
        dir_x: 0,
        dir_y: 1
    }
    ],
    STREAM180: [{
        rotation: 0,
        x: 180,
        y: -90,
        dir_x: 0,
        dir_y: 0
    },
    {
        rotation: 0,
        x: 180,
        y: 620,
        dir_x: 0,
        dir_y: 1
    }
    ],
    STREAM300: [{
        rotation: 0,
        x: 300,
        y: -90,
        dir_x: 0,
        dir_y: 0
    },
    {
        rotation: 0,
        x: 300,
        y: 620,
        dir_x: 0,
        dir_y: 1
    }
    ],
    STREAM420: [{
        rotation: 0,
        x: 420,
        y: -90,
        dir_x: 0,
        dir_y: 0
    },
    {
        rotation: 0,
        x: 420,
        y: 620,
        dir_x: 0,
        dir_y: 1
    }
    ],
    STREAM540: [{
        rotation: 0,
        x: 540,
        y: -90,
        dir_x: 0,
        dir_y: 0
    },
    {
        rotation: 0,
        x: 540,
        y: 620,
        dir_x: 0,
        dir_y: 1
    }
    ],
    STREAM660: [{
        rotation: 0,
        x: 660,
        y: -90,
        dir_x: 0,
        dir_y: 0
    },
    {
        rotation: 0,
        x: 660,
        y: 620,
        dir_x: 0,
        dir_y: 1
    }
    ],
    INLEFTTURNDOWN: [{
        rotation: 0,
        x: -90,
        y: 256,
        dir_x: 0,
        dir_y: 0
    },
    {
        rotation: 0,
        x: 480,
        y: 256,
        dir_x: 1,
        dir_y: 0
    },
    {
        rotation: 0,
        x: 480,
        y: 620,
        dir_x: 0,
        dir_y: 1
    }
    ],
    INRIGHTTURNDOWN: [{
        rotation: 0,
        x: 810,
        y: 256,
        dir_x: 0,
        dir_y: 0
    },
    {
        rotation: 0,
        x: 240,
        y: 256,
        dir_x: -1,
        dir_y: 0
    },
    {
        rotation: 0,
        x: 240,
        y: 620,
        dir_x: 0,
        dir_y: 1
    }
    ],
   
};

const enemySpeed = {
    slow: 20 / 1000,
    medium: 30 / 1000,
    fast: 40 / 1000,
    veryfast: 50 / 1000
};



const AttackBlocks = {
    STREAMDOWN : [
        WayPoints['STREAM60'],
        WayPoints['STREAM180'],
        WayPoints['STREAM300'],
        WayPoints['STREAM420'],
        WayPoints['STREAM540'],
        WayPoints['STREAM660']
    ],

    STREAMDOWNMIXED : [
        WayPoints['STREAM300'],
        WayPoints['STREAM420'],
        WayPoints['STREAM660'],
        WayPoints['STREAM540'],
        WayPoints['STREAM180'],
        WayPoints['STREAM60']
    ],

    BADDIETYPE1 : [
        WayPoints['INRIGHTTURNDOWN']
    ]
}

let EnemySequences = [];

const GameSettings = {
    keyPress: {
        left: 37,
        right: 39,
        up: 38,
        down: 40,
        space: 32
    },
    targetFPS: 1000 / 60,

    bulletSpeed: 800 / 1000,
    bulletLife: 4000,
    bulletFireRate: 200,
    bulletTop: 1,

    playAreaWidth: 720,
    playAreaHeight: 576,
    playAreaDiv: '#playArea',

    playerFlashOpacity: '1',
    playerFlashTime: 300,
    playerFlashes: 8,

    playerDivName: 'playerSprite',
    playerStart: {
        x: 360,
        y: 440
    },
    playerStartLives: 5,
    playerState: {
        ok: 0,
        dead: 1,
        hitFlashing: 2
    },
    playerMoveStep: 10,
    enemyState: {
        ready: 1,
        dead: 0,
        movingToWaypoint: 2
    },
    pressSpaceDelay: 3000,
    gamePhaser: {
        readyToplay: 1,
        countdownToStart: 2,
        playing: 3,
        gameOver: 4
    },
    countdownGap: 700,
    countDownValues: ['3', '2', '1', 'GO!'],
    explosionTimeout: 100,
    

};

let GameManager = {
    assets : {},
    player: undefined,
    bullets: undefined,
    explosions: undefined,
    sounds: {},
    timeouts: [],
    phaser: GameSettings.gamePhaser.gameOver,
    lastUpdated: Date.now(),
    elapsedTime: 0,
    fps: 0
};

function GetRandInt(from, range) {
    return Math.floor(Math.random() * range) + from;
}

function removeStars() {
    $('.star').remove();
}

function pauseStars() {
    $('.star').css({
        "animation-play-state": "paused"
    });
}

function addStar(starClass) {
    let div = document.createElement("div");
    div.classList.add("star", starClass);
    div.style.left = GetRandInt(0, 720) + "px";
    $(GameSettings.playAreaDiv).append(div);
}

function createStars() {
    for(let i = 0; i < 10; ++i) {
        let delay = i * 123;
        GameManager.timeouts.push(window.setTimeout(addStar, delay, "starSmall"));
        GameManager.timeouts.push(window.setTimeout(addStar, delay + 123, "starMedium"));
        GameManager.timeouts.push(window.setTimeout(addStar, delay + 321, "starBig"));
    }
}

function loadSound(fileName) {
    GameManager.sounds[fileName] = new Audio(soundPath + fileName + '.wav');
}

function initSounds() {
    for (let i = 0; i < soundFiles.length; ++i) {
		loadSound(soundFiles[i]);
	}
}

function playSound(sound) {
    GameManager.sounds[sound].play();
}

class Sprite {
    constructor(divName, position, imgName, sizePx) {
        this.position = position;
        this.divName = divName;
        this.imgName = imgName;
        this.size = sizePx;
        this.anchorShift = new Point(-this.size.width / 2, -this.size.height / 2);
        this.containingBox = new Rect(this.position.x, this.position.y, 
            this.size.width, this.size.height);
    }

    addToBoard(shift) {
        let div = document.createElement("div");
        div.classList.add("sprite");
        div.id = this.divName;
        div.style.backgroundImage = "url('" + this.imgName + "')";
        div.style.width = this.size.width + 'px';
        div.style.height = this.size.height + 'px';
        $(GameSettings.playAreaDiv).append(div);

        this.setPosition(this.position.x, this.position.y, shift);

    } 

    removeFromBoard() {
        $('#' + this.divName).remove();
    }

    draw() {
        $('#' + this.divName).css({
            "left": this.position.x,
            "top": this.position.y
        }); 
    }

    setPosition(x, y, shift) {
        this.position.update(x, y);
        this.containingBox.update(this.position.x, this.position.y);
        if (shift == true) {
            this.incrementPosition(this.anchorShift.x, this.anchorShift.y);
        }
        this.draw();
    }

    updatePosition(x, y) {
        this.position.update(x,y);
        this.containingBox.update(this.position.x, this.position.y);
        this.draw();
    }

    incrementPosition(ix, iy) {
        this.position.increment(ix,iy);
        this.containingBox.update(this.position.x, this.position.y);
        this.draw();
    }

    getCenterPoint() {
        return new Point(this.position.x - this.anchorShift.x,
            this.position.y - this.anchorShift.y);
    }

}

class Bullet extends Sprite {
    constructor(divName, assetDesc, position) {
        super(divName, position, assetDesc.fileName, new Size(assetDesc.width, assetDesc.height));
        this.life = GameSettings.bulletLife;
        this.dead = false;
        this.addToBoard(true);
    }

    update(dt) {
        let inc = dt * GameSettings.bulletSpeed;
        this.incrementPosition(0, -inc);
        this.life -= dt;
        if (this.life < 0) {
            this.killMe();
        }
    }

    killMe() {
        this.dead = true;
        this.removeFromBoard();
    }
}

class BulletCollection {
    constructor(player) {
        this.listBullets = [];
        this.lastAdded = 0;
        this.player = player;
        this.total_bullets = 0;
    }

    reset() {
        for (let i = 0; i < this.listBullets.length; ++i) {
            this.listBullets[i].removeFromBoard();
        }
        this.listBullets = [];
        this.lastAdded = 0;
        this.total_bullets = 0;
    }

    update(dt) {
        for (let i = this.listBullets.length - 1; i >= 0; --i) {
            if (this.listBullets[i].dead == true) {
                this.listBullets.splice(i, 1);
            } else {
                this.listBullets[i].update(dt);
            }
        }
        this.lastAdded += dt;

        if (this.lastAdded > GameSettings.bulletFireRate && 
            this.player.state != GameSettings.playerState.hitFlashing) {
                this.lastAdded = 0;
                this.listBullets.push(
                    new Bullet(
                        'bullet_' + this.total_bullets,
                        GameManager.assets['Lasers/laserBlue02_s'],
                        new Point(this.player.position.x + (this.player.size.width / 2), 
                        this.player.position.y)
                    )
                );
                this.total_bullets++;
            }
    }
}

class Player extends Sprite {
    constructor(divName, position, assetDesc, boundaryRect) {
        super(divName, position, assetDesc.fileName, 
            new Size(assetDesc.width, assetDesc.height));
        this.lives = GameSettings.playerStartLives;    
        this.score = 0;
        this.highScore = 0;
        this.hit = false;
        this.lastFlash = 0;
        this.numFlashes = 0;
        this.state = GameSettings.playerState.ok;
        this.boundaryRect = boundaryRect;
        this.boundaryRect.shift(this.anchorShift.x, this.anchorShift.y);
    }

    reset() {
        this.state = GameSettings.playerState.ok;
        this.score = 0;
        this.hit = false;
        this.lastFlash = 0;
        this.numFlashes = 0;
        this.lives = GameSettings.playerStartLives;
        this.setLives();
        this.setScore();
        this.setHighScore();
        this.setPosition(GameSettings.playerStart.x, GameSettings.playerStart.y, true );
    }

    update(dt) {

        switch(this.state) {
            case GameSettings.playerState.hitFlashing:
                this.lastFlash += dt;
                if (this.lastFlash > GameSettings.playerFlashTime) {
                    this.lastFlash = 0;
                    this.numFlashes++;
                    if (this.numFlashes == GameSettings.playerFlashes) {
                        this.state = GameSettings.playerState.ok;
                        $('#' + this.divName).show();
                        this.hit = false;
                        $('#' + this.divName).css({'opacity' : '1.0'});
                    } else {
                        if (this.numFlashes % 2 == 1) { 
                            $('#' + this.divName).hide();
                        } else {
                            $('#' + this.divName).show();
                        }
                    }
                }
            break;
        }

        if (this.hit == true && this.state != GameSettings.playerState.hitFlashing) {
            this.state = GameSettings.playerState.hitFlashing;
            this.lastFlash = 0;
            this.numFlashes = 0;
            this.lives--;
            this.setLives();
            playSound('loselife');
            console.log('player hit!!');
            if (this.lives > 0) {
                $('#' + this.divName).css({'opacity' : GameSettings.playerFlashOpacity});
            }
        }

    }

    move(x, y) {
        let xStep = GameSettings.playerMoveStep * x;
        let yStep = GameSettings.playerMoveStep * y;

        if (this.boundaryRect.OutsideHorizontal(xStep + this.position.x) == true) {
            xStep = 0;
        }
        if (this.boundaryRect.OutsideVertical(yStep + this.position.y) == true) {
            yStep = 0;
        }

        this.incrementPosition(xStep, yStep);
    }

    incrementScore (amount) {
        this.score += amount;
        this.setScore();
        this.setHighScore();
    }

    setLives() {
        $('#lives').text('x ' + this.lives);
    }
    setScore() {
        $('#score').text(this.score);
    }
    setHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        $('#highScore').text(this.highScore);
    }


}

class Enemy extends Sprite {
    constructor(divName, assetDesc, player, sequence) {
        super(divName, new Point(0,0), assetDesc.fileName, new Size(assetDesc.width, assetDesc.height));
        this.state = GameSettings.enemyState.ready;
        this.waypointList = [];
        this.targetWayPointNumber = 0;
        this.targetWayPoint = new Waypoint(0,0,0,0);
        this.lastWayPointIndex = 0;
        this.player = player;
        this.score = sequence.score;
        this.lives = sequence.lives;
        this.speed = sequence.speed;
        this.readInWaypoints(sequence.waypoints);
    }

    readInWaypoints(wpList) {
        this.waypointList = [];
        for (let i = 0; i < wpList.length; ++i) {
            let t_wp = wpList[i];
            let n_wp = new Waypoint(
                t_wp.x + this.anchorShift.x , 
                t_wp.y + this.anchorShift.y, 
                t_wp.dir_x, 
                t_wp.dir_y
                );
            this.waypointList.push(n_wp);
        }
    }

    update(dt) {
        switch(this.state) {
            case GameSettings.enemyState.movingToWaypoint:
                this.moveTowardPoint(dt);
                this.checkplayerCollision();
            break;
        }
    }

    checkplayerCollision() {
        if(this.containingBox.IntersectedBy(this.player.containingBox) == true) {
            if (this.player.hit == false) {
                this.player.hit = true;
                console.log('collision with player');
            }
        }
    }

    moveTowardPoint(dt) {
        let inc = dt * this.speed;
        this.incrementPosition(inc * this.targetWayPoint.dir_x, inc * this.targetWayPoint.dir_y);

        if(Math.abs(this.position.x - this.targetWayPoint.point.x) < Math.abs(inc) &&
        Math.abs(this.position.y - this.targetWayPoint.point.y) < Math.abs(inc)) {
            this.updatePosition( this.targetWayPoint.point.x,  this.targetWayPoint.point.y);
        }

        if(this.position.equalToPoint(this.targetWayPoint.point.x, this.targetWayPoint.point.y) == true) {
            if (this.targetWayPointNumber == this.lastWayPointIndex) {
                this.killMe();
                console.log('reached end');
            } else {
                this.setNextWayPoint();
            }
        }
    }

    setNextWayPoint() {
        this.targetWayPointNumber++;
        this.targetWayPoint = this.waypointList[this.targetWayPointNumber];
    }

    killMe() {
        this.state = GameSettings.enemyState.dead;
        this.removeFromBoard();
    }

    setMoving() {
        this.targetWayPointNumber = 0;
        this.targetWayPoint = this.waypointList[this.targetWayPointNumber];
        this.lastWayPointIndex = this.waypointList.length - 1;
        this.setPosition(this.targetWayPoint.point.x, this.targetWayPoint.point.y, false);
        this.addToBoard(false);
        this.targetWayPointNumber = 1;
        this.targetWayPoint = this.waypointList[this.targetWayPointNumber];
        this.state = GameSettings.enemyState.movingToWaypoint;
    }
}

class EnemyCollection {
    constructor(player, bullets, explosions) {
        this.listEnemies = [];
        this.lastAdded = 0;
        this.gameOver = false;
        this.sequenceIndex = 0;
        this.sequencesDone = false;
        this.count = 0;
        this.player = player;
        this.bullets = bullets;
        this.explosions = explosions;
    }

    reset() {
        this.killAll();
        this.listEnemies = [];
        this.lastAdded = 0;
        this.gameOver = false;
        this.sequenceIndex = 0;
        this.sequencesDone = false;
        this.count = 0;
    }

    killAll() {
        for (let i = 0; i < this.listEnemies.length; ++i) {
            this.listEnemies[i].killMe();
        }
    }
    
    update(dt) {
        this.lastAdded += dt;
        if (this.sequencesDone == false && 
            EnemySequences[this.sequenceIndex].delayBefore < this.lastAdded) {
            this.addEnemy();
        }

        for (let i = this.listEnemies.length - 1; i >= 0; --i) {
            if (this.listEnemies[i].state == GameSettings.enemyState.dead) {
                this.listEnemies.splice(i, 1);
            } else if (this.listEnemies[i].state == GameSettings.enemyState.movingToWaypoint){
                let en = this.listEnemies[i];

                for (let b = 0; b < this.bullets.listBullets.length; ++b) {
                    let bu = this.bullets.listBullets[b];
                    if (bu.dead == false &&
                        bu.position.y > GameSettings.bulletTop &&
                        en.containingBox.IntersectedBy(bu.containingBox) == true) {
                            bu.killMe();
                            en.lives--;
                            if (en.lives <= 0) {
                                playSound('explosion');
                                this.player.incrementScore(en.score);
                                en.killMe();
                                let cp = en.getCenterPoint();
                                this.explosions.createExplosion( new Point(cp.x, cp.y));
                            }
                    }
                }

                en.update(dt);
            }
        }

        this.checkGameOver();
    }
    
    checkGameOver() {
        if (this.listEnemies.length == 0 && this.sequencesDone == true) {
            this.gameOver = true;
            console.log('game over');   
        }
    }
    
    addEnemy() {
        // 
        let seq = EnemySequences[this.sequenceIndex];
        let en_new = new Enemy('en_' + this.count, GameManager.assets[seq.image],
        this.player, seq );
        this.listEnemies.push(en_new);
        en_new.setMoving();
        this.count++;
        this.sequenceIndex++;
        this.lastAdded = 10;
        if (this.sequenceIndex == EnemySequences.length) {
            this.sequencesDone = true;
            console.log('seuences done');
        }
    }
}


function addEnemySequence(delayBefore, delayBetween, image, score, 
    lives, speed, number, waypoints) {
    for (let i = 0; i < number; ++i) {
        let delay = delayBetween;
        if(i == 0) {
            delay = delayBefore;
        }
        EnemySequences.push(
            {
            delayBefore: delay,
            image: image,
            waypoints: waypoints,
            score: score,
            lives: lives,
            speed: speed
            }
        )
    }
}

function createSequence(delayBetween, image, number, attackBlock, score, lives, speed, delayBefore) {

    for (let i = 0; i < attackBlock.length; ++i) {
        let delay = delayBetween;
        if (i == 0) {
            delay = delayBefore
        }
        //console.log('adding sequence between:' , delayBetween, ' before: ' , delayBefore, ' delay:' , delay, ' block:' , attackBlock);
        addEnemySequence(delay, delayBetween, image, score, lives, speed, number, attackBlock[i]);
    }
}

function setUpSequences() {
    createSequence(1000,'Enemies/enemyGreen2', 1,  AttackBlocks.STREAMDOWNMIXED, 10, 1, enemySpeed.veryfast, 10);
    createSequence(800,'Enemies/enemyBlack4', 1,  AttackBlocks.STREAMDOWNMIXED, 10, 1, enemySpeed.slow, 20);
    createSequence(1000,'Enemies/enemyBlue3', 2,  AttackBlocks.STREAMDOWNMIXED, 20, 1, enemySpeed.medium, 20);
    createSequence(900,'Enemies/enemyBlue3', 1,  AttackBlocks.STREAMDOWNMIXED, 10, 1, enemySpeed.fast, 70);
    createSequence(1200,'Enemies/enemyBlack4', 1,  AttackBlocks.STREAMDOWNMIXED, 10, 2, enemySpeed.medium, 30);
    createSequence(900,'Enemies/enemyBlue3', 2,  AttackBlocks.STREAMDOWNMIXED, 20, 1, enemySpeed.slow, 30);
    createSequence(1000,'Enemies/enemyGreen2', 1,  AttackBlocks.STREAMDOWNMIXED, 10, 1, enemySpeed.medium, 20);
    createSequence(800,'Enemies/enemyRed1', 1,  AttackBlocks.STREAMDOWNMIXED, 10, 1, enemySpeed.veryfast, 20);
    createSequence(1000,'Enemies/enemyBlue3', 2,  AttackBlocks.STREAMDOWNMIXED, 20, 1, enemySpeed.slow, 20);
    createSequence(900,'Enemies/enemyGreen2', 1,  AttackBlocks.STREAMDOWN, 10, 1, enemySpeed.medium, 20);
    createSequence(800,'Enemies/enemyGreen2', 1,  AttackBlocks.STREAMDOWN, 10, 1, enemySpeed.fast, 20);
    createSequence(400,'Enemies/enemyRed5', 1,  AttackBlocks.BADDIETYPE1, 500, 8, enemySpeed.slow, 50);
    createSequence(1000,'Enemies/enemyBlack4', 2,  AttackBlocks.STREAMDOWNMIXED, 20, 2, enemySpeed.medium, 20);
    createSequence(900,'Enemies/enemyBlue3', 1,  AttackBlocks.STREAMDOWN, 10, 2, enemySpeed.medium, 20);
    createSequence(800,'Enemies/enemyRed1', 1,  AttackBlocks.STREAMDOWN, 10, 2, enemySpeed.veryfast, 20);
    createSequence(1000,'Enemies/enemyBlue3', 2,  AttackBlocks.STREAMDOWNMIXED, 20, 1, enemySpeed.slow, 20);
    createSequence(900,'Enemies/enemyGreen2', 1,  AttackBlocks.STREAMDOWNMIXED, 10, 1, enemySpeed.fast, 20);
    createSequence(800,'Enemies/enemyGreen2', 1,  AttackBlocks.STREAMDOWNMIXED, 10, 1, enemySpeed.slow, 20);
    createSequence(1000,'Enemies/enemyBlack4', 2,  AttackBlocks.STREAMDOWNMIXED, 20, 1, enemySpeed.medium, 20);
    createSequence(900,'Enemies/enemyBlue3', 1,  AttackBlocks.STREAMDOWNMIXED, 10, 1, enemySpeed.veryfast, 20);
    console.log("EnemySequences:" , EnemySequences);

};


$(function () {
console.log('ready..!');
console.log("GameSettings:GameSettings", GameSettings);
initSounds();
setUpSequences();
$(document).keydown(function (e) {
if (GameManager.phaser == GameSettings.gamePhaser.readyToplay) {
    if (e.which == GameSettings.keyPress.space) {
        runCountDown();
    }
} else if (GameManager.phaser == GameSettings.gamePhaser.playing) {
    switch (e.which) {
        case GameSettings.keyPress.up:
            GameManager.player.move(0, -1);
            break;
        case GameSettings.keyPress.down:
            GameManager.player.move(0, 1);
            break;
        case GameSettings.keyPress.left:
            GameManager.player.move(-1, 0);
            break;
        case GameSettings.keyPress.right:
            GameManager.player.move(1, 0);
            break;
    }
} else if (GameManager.phaser == GameSettings.gameOver) {
    if (e.which == GameSettings.keyPress.space) {
        resetGame();
    }
}
});
processAsset(0);
});

class Explosions {
    constructor(assetName) {
        this.count = 0;
        this.offset = undefined;
        this.setOffSet(assetName);
    }

    setOffSet(assetName) {
        let asset = GameManager.assets[assetName];
        this.offSet = new Point((asset.width/2)*-1, (asset.height/2)*-1); 
    }

    createExplosion(position) {
        let div = document.createElement("div");
        div.classList.add("explosion");
        let divId = 'explosion_' + this.count;
        div.id = divId;
        div.style.left = (position.x + this.offSet.x) + 'px';
        div.style.top = (position.y + this.offSet.y) + 'px';
        $(GameSettings.playAreaDiv).append(div);
        setTimeout(function() {
            $('#' + divId).remove();
        }, GameSettings.explosionTimeout);

        this.count++;
    }
}

class Waypoint {
    constructor(x,y,dir_x,dir_y) {
        this.point = new Point(x, y);
        this.dir_x = dir_x;
        this.dir_y = dir_y;
    }
}
        
class Rect {
    constructor(x, y, width, height) {
        this.origin = new Point(x, y);
        this.size = new Size(width, height);
        this.max = new Point(this.origin.x + this.size.width, this.origin.y + this.size.height);
    }

    update(x, y) {
        this.origin.x = x;
        this.origin.y = y;
        this.max.x = this.origin.x + this.size.width;
        this.max.y = this.origin.y + this.size.height;
    }

    shift(x, y) {
        this.update(this.origin.x + x, this.origin.y + y);
    }

    OutsideHorizontal(x) {
        if (x < this.origin.x || x > this.max.x) {
            return true;
        } else {
            return false;
        }
    }

    OutsideVertical(y) {
        if (y < this.origin.y || y > this.max.y) {
            return true;
        } else {
            return false;
        }
    }

    IntersectedBy(rect) {
       
        if (this.origin.x > rect.max.x || rect.origin.x > this.max.x) {
            return false;
        }

        if (this.origin.y > rect.max.y || rect.origin.y > this.max.y) {
            return false;
        }
        return true;
    }

}

class Size {
    constructor(w, h) {
        this.width = w;
        this.height = h;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    update(x, y) {
        this.x = x;
        this.y = y;
    }

    increment(ix, iy) {
        this.x += ix;
        this.y += iy;
    }

    equalToPoint(x, y) {
        if (this.x == x && this.y == y) {
            return true;
        }
        return false;
    }

}

    },

    update: function(){


        class Point {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }
        
            update(x, y) {
                this.x = x;
                this.y = y;
            }
        
            increment(ix, iy) {
                this.x += ix;
                this.y += iy;
            }
        
            equalToPoint(x, y) {
                if (this.x == x && this.y == y) {
                    return true;
                }
                return false;
            }
        
        }
    }
      

});

var config = {
    type: Phaser.AUTO,
    width: 1366,
    height: 768,
    scene: [ScenePlay]
};

var game = new Phaser.Game(config);