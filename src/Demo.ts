import 'phaser'
import ball from '@/assets/images/ball.png'
import panel from '@/assets/images/panel.png'
import block from '@/assets/images/block.png'

import Text = Phaser.GameObjects.Text
import Sprite = Phaser.GameObjects.Sprite
import ArcadeSprite = Phaser.Physics.Arcade.Sprite
import Rectangle = Phaser.Geom.Rectangle
import Line = Phaser.Geom.Line
import Point = Phaser.Geom.Point

interface Ball extends ArcadeSprite {
  collected: boolean
  row: number
  body: Phaser.Physics.Arcade.Body
}

interface Block extends ArcadeSprite {
  value: number
  row: number
  text: Text
  body: Phaser.Physics.Arcade.Body
}

interface ICollision {
  collisionDistance: number,
  collisionAngle: number,
  collisionPoint?: Point,
  collisionLine?: Line,
}

let game;
let gameOptions = {

  // ball size, compared to game width
  ballSize: 0.04,

  // ball speed, in pixels per second
  ballSpeed: 1000,

  // blocks per line, or block columns :)
  blocksPerLine: 7,

  // block lines
  blockLines: 8,

  // max amount of blocks per line
  maxBlocksPerLine: 4,

  // probability 0 -> 100 of having an extra ball in each line
  extraBallProbability: 60,

  // predictive trajectory length, in pixels
  trajectoryLength: 1200
}
window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0x444444,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 640,
      height: 960
    },
    physics: {
      default: "arcade"
    },
    scene: playGame
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}

// game states
const WAITING_FOR_PLAYER_INPUT = 0;
const PLAYER_IS_AIMING = 1;
const BALLS_ARE_RUNNING = 2;
const ARCADE_PHYSICS_IS_UPDATING = 3;
const PREPARING_FOR_NEXT_MOVE = 4;

export default class playGame extends Phaser.Scene {
  gameState: number
  gameOver: boolean
  level: number
  recycledBlocks: Array<any>
  blockSize: number
  gameFieldHeight: number
  emptySpace: number
  ballSize: number

  blockGroup: Phaser.Physics.Arcade.Group
  ballGroup: Phaser.Physics.Arcade.Group
  extraBallGroup: Phaser.Physics.Arcade.Group

  bottomPanel: Sprite
  trajectoryGraphics: Phaser.GameObjects.Graphics

  legalAngleOfFire: boolean

  direction: number

  ballVertice: Point

  fieldSegments: Line[]

  landedBalls: number

  firstBallToLand: any

  constructor() {
    super("PlayGame");
  }

  preload() {
    this.load.image("ball", ball);
    this.load.image("panel", panel);
    this.load.image("block", block);
  }

  create() {

    // at the beginning of the game, we wait for player input
    this.gameState = WAITING_FOR_PLAYER_INPUT;

    // it's not game over... yet
    this.gameOver = false;

    // we start from level zero
    this.level = 0;

    // array used to recycle destroyed blocks
    this.recycledBlocks = [];

    // determine block size according to game width and the number of blocks for each line
    this.blockSize = game.config.width / gameOptions.blocksPerLine;

    // determine game field height according to block size and block lines
    this.gameFieldHeight = this.blockSize * gameOptions.blockLines;

    // empty space is the amount of the stage not covered by game field
    this.emptySpace = game.config.height - this.gameFieldHeight;

    // set bounds of the physics world
    this.physics.world.setBounds(0, this.emptySpace / 2, game.config.width, this.gameFieldHeight);

    // creation of physics groups where to place blocks, balls and extra balls
    this.blockGroup = this.physics.add.group();
    this.ballGroup = this.physics.add.group();
    this.extraBallGroup = this.physics.add.group();

    // the upper panel is called scorePanel because probably you'll want to display player score here
    let scorePanel = this.add.sprite(game.config.width / 2, 0, "panel");
    scorePanel.displayWidth = game.config.width;
    scorePanel.displayHeight = this.emptySpace / 2;
    scorePanel.setOrigin(0.5, 0);

    // bottom panel
    this.bottomPanel = this.add.sprite(game.config.width / 2, game.config.height, "panel");
    this.bottomPanel.displayWidth = game.config.width;
    this.bottomPanel.displayHeight = this.emptySpace / 2;
    this.bottomPanel.setOrigin(0.5, 1);

    // determine actual ball size in pixels
    this.ballSize = game.config.width * gameOptions.ballSize;

    // add the first ball
    this.addBall(game.config.width / 2, game.config.height - this.bottomPanel.displayHeight - this.ballSize / 2, false);

    // add the trajectory graphics
    this.trajectoryGraphics = this.add.graphics().setDepth(10);

    // add a block line
    this.addBlockLine();

    // input listeners
    this.input.on("pointerdown", this.startAiming, this);
    this.input.on("pointerup", this.shootBall, this);
    this.input.on("pointermove", this.adjustAim, this);

    // lister for collision with world bounds
    this.physics.world.on("worldbounds", this.checkBoundCollision, this);
  }

  // method to add the ball at a given position x, y. The third argument tells us if it's an extra ball
  addBall(x, y, isExtraBall) {

    // ball creation as a child of ballGroup or extraBallGroup
    let ball: Ball = isExtraBall ? this.extraBallGroup.create(x, y, "ball") : this.ballGroup.create(x, y, "ball");

    // resize the ball
    ball.displayWidth = this.ballSize;
    ball.displayHeight = this.ballSize;

    // maximum bounce
    ball.body.setBounce(1, 1);

    // if it's an extra ball...
    if (isExtraBall) {

      // set a custom "row" property to 1
      ball.row = 1;

      // set a custom "collected" property to false
      ball.collected = false;
    }

    // if it's not an extra ball...
    else {

      // ball collides with world bounds
      ball.body.collideWorldBounds = true;

      // ball fires a listener when colliding on world bounds
      ball.body.onWorldBounds = true;
    }
  }

  // method to add a block line
  addBlockLine() {

    // increase level number
    this.level++;

    // array where to store placed blocks positions
    let placedBlocks: Array<any> = [];

    // will we place an extra ball too?
    let placeExtraBall = Phaser.Math.Between(0, 100) < gameOptions.extraBallProbability;

    // execute the block "gameOptions.maxBlocksPerLine" times
    for (let i = 0; i < gameOptions.maxBlocksPerLine; i++) {

      // random block position
      let blockPosition = Phaser.Math.Between(0, gameOptions.blocksPerLine - 1);

      // is this block position empty?
      if (placedBlocks.indexOf(blockPosition) == -1) {

        // save this block position
        placedBlocks.push(blockPosition);

        // should we place an extra ball?
        if (placeExtraBall) {

          // no more extra balls
          placeExtraBall = false;

          // add the extra ball
          this.addBall(blockPosition * this.blockSize + this.blockSize / 2, this.blockSize / 2 + this.emptySpace / 2, true);
        }

        // this time we don't place an extra ball, but a block
        else {

          // if we don't have any block to recycle...
          if (this.recycledBlocks.length == 0) {

            // add a block
            this.addBlock(blockPosition * this.blockSize + this.blockSize / 2, this.blockSize / 2 + this.emptySpace / 2, false);

          }
          else {

            // recycle a block
            this.addBlock(blockPosition * this.blockSize + this.blockSize / 2, this.blockSize / 2 + this.emptySpace / 2, true)
          }
        }
      }
    }

    // here we store all segments where to check for collisions
    this.fieldSegments = [];

    // get physics world bounds
    let boundRectangle = new Rectangle(0, this.emptySpace / 2, game.config.width, this.gameFieldHeight);

    // turn world bounds into segments
    this.addTofieldSegments(boundRectangle);

    // iterate through all blocks
    Phaser.Actions.Call(this.blockGroup.getChildren(), (block) => {

      // get block bounding box
      let rectangle = (block as ArcadeSprite).getBounds();

      // turn bounding box into segments
      this.addTofieldSegments(rectangle);
    }, this);
  }

  // method to add a block at a given x,y position. The third argument tells us if the block is recycled
  addBlock(x, y, isRecycled) {

    // block creation as a child of blockGroup
    let block: Block = isRecycled ? this.recycledBlocks.shift() : this.blockGroup.create(x, y, "block");

    // resize the block
    block.displayWidth = this.blockSize;
    block.displayHeight = this.blockSize;

    // custom property to save block value
    block.value = this.level;

    // custom property to save block row
    block.row = 1;

    // if the block is recycled...
    if (isRecycled) {
      block.x = x;
      block.y = y;
      block.text.setText(block.value.toString());
      block.text.x = block.x;
      block.text.y = block.y;
      block.setVisible(true);
      block.text.setVisible(true);
      this.blockGroup.add(block);
    }

    // if the block is not recycled...
    else {
      // text object to show block value
      let text = this.add.text(block.x, block.y, block.value.toString(), {
        font: "bold 32px Arial",
        align: "center",
        color: "#000000"
      });
      text.setOrigin(0.5);

      // text object is stored as a block custom property
      block.text = text;
    }

    // block is immovable, does not react to collisions
    block.body.immovable = true;
  }

  // method to get the ball position
  getBallPosition() {

    // select gallGroup children
    let children = this.ballGroup.getChildren();

    // return x and y properties of first child
    // @ts-ignore
    return new Phaser.Geom.Point(children[0].x, children[0].y);
  }

  // method to start aiming
  startAiming() {
    // are we waiting for player input?
    if (this.gameState == WAITING_FOR_PLAYER_INPUT) {

      // the angle of fire is not legal at the moment
      this.legalAngleOfFire = false;

      // change game state because now the player is aiming
      this.gameState = PLAYER_IS_AIMING;
    }
  }

  // method to adjust the aim
  adjustAim(e) {
    // is the player aiming?
    if (this.gameState == PLAYER_IS_AIMING) {
      const { x: ballX, y: ballY } = this.getBallPosition()

      // determine x and y distance between current and initial input
      let distY = ballY - e.y;

      // is y distance greater than 10, that is: is the player dragging down?
      if (distY > 10) {

        // this is a legal agne of fire
        this.legalAngleOfFire = true;

        // determine dragging direction
        this.direction = Phaser.Math.Angle.Between(ballX, ballY, e.x, e.y);

        // trajectory direction at the moment is the same as future ball direction
        let trajectoryDirection = this.direction;

        // set trajectory length
        let trajectoryLength = gameOptions.trajectoryLength;

        // clear trajectory graphics
        this.trajectoryGraphics.clear();

        // set trajectory graphics line style
        this.trajectoryGraphics.lineStyle(1, 0x00ff00);

        // get ball bounding box vertices
        this.ballVertice = this.getBallPosition();

        // predictive trajectory loop
        do {

          // here we will store all collision information, starting from the distance, initally set as a very high number
          const collisionObject: ICollision = {
            collisionDistance: 10000,
            collisionAngle: 0,
          }

          // determine trajectory line
          let trajectoryLine = new Phaser.Geom.Line(this.ballVertice.x, this.ballVertice.y, this.ballVertice.x + trajectoryLength * Math.cos(trajectoryDirection), this.ballVertice.y + trajectoryLength * Math.sin(trajectoryDirection));

          // iterate through all field segments
          this.fieldSegments.forEach((line: Line) => {

            // create a new temp point outside game field
            let intersectionPoint = new Phaser.Geom.Point(-1, -1);

            // assign temp point the valie of the intersection point between trajectory and polygon line, if any
            Phaser.Geom.Intersects.LineToLine(trajectoryLine, line, intersectionPoint);

            // if the intersection point is inside the field...
            if (intersectionPoint.x != -1) {

              // determine distance between intersection point and vertex
              let distance = Phaser.Math.Distance.BetweenPoints(intersectionPoint, this.ballVertice);

              // if the distance is less than current collision object distance, but greater than 1, to avoid collision with the line we just checked...
              if (distance < collisionObject.collisionDistance && distance > 1) {

                // update collision object distance
                collisionObject.collisionDistance = distance;

                // save collision point
                collisionObject.collisionPoint = new Phaser.Geom.Point(intersectionPoint.x, intersectionPoint.y);

                // save collision angle
                collisionObject.collisionAngle = Phaser.Geom.Line.Angle(line);

                // save collision line
                collisionObject.collisionLine = Phaser.Geom.Line.Clone(line);
              }
            }
          });

          // if there was a collision point...
          if (collisionObject.collisionPoint) {
            // draw a line between the vertex and the collision point
            this.trajectoryGraphics.lineBetween(this.ballVertice.x, this.ballVertice.y, collisionObject.collisionPoint.x, collisionObject.collisionPoint.y);

            // set trajectoryGraphics fill style
            this.trajectoryGraphics.fillStyle(0xff0000, 0.5);

            // squareOrigin will contain the center of the ball, given the collision point
            const squareOrigin = collisionObject.collisionPoint
            this.trajectoryGraphics.fillRect(squareOrigin.x - this.ballSize / 2, squareOrigin.y - this.ballSize / 2, this.ballSize, this.ballSize);

            // determine  new trajectory direction according to surface angle
            if (Phaser.Math.RadToDeg(collisionObject.collisionAngle) % 180 == 0) {
              trajectoryDirection = 2 * Math.PI - trajectoryDirection;
            }
            else {
              trajectoryDirection = Math.PI - trajectoryDirection;
            }
            trajectoryDirection = Phaser.Math.Angle.Wrap(trajectoryDirection);

            // determine new ball vertices
            this.ballVertice = squareOrigin;
          }

          // calculate the lenght of the remaining trajectory
          trajectoryLength -= collisionObject.collisionDistance;

          // keep looping while trajectory length is greater than zero
        } while (trajectoryLength > 0);

        // y distance is smaller than 10, that is: player is not dragging down
      } else {

        // not a legal angle of fire
        this.legalAngleOfFire = false;

        // hide trajectory graphics
        this.trajectoryGraphics.clear();
      }
    }
  }

  // method to turn a rectangle into 4 segments
  addTofieldSegments(rectangle) {
    this.fieldSegments.push(rectangle.getLineA());
    this.fieldSegments.push(rectangle.getLineB());
    this.fieldSegments.push(rectangle.getLineC());
    this.fieldSegments.push(rectangle.getLineD());
  }

  // method to shoot the ball
  shootBall() {

    // is the player aiming?
    if (this.gameState == PLAYER_IS_AIMING) {

      // hide trajectory graphics
      this.trajectoryGraphics.clear();

      // do we have a legal angle of fire?
      if (this.legalAngleOfFire) {

        // change game state
        this.gameState = BALLS_ARE_RUNNING;

        // no balls have landed already
        this.landedBalls = 0;

        // iterate through all balls
        this.ballGroup.getChildren().forEach((ball, index) => {

          // add a timer event which fires a ball every 0.1 seconds
          this.time.addEvent({
            delay: 100 * index,
            callbackScope: this,
            callback: () => {
              // set ball velocity
              (ball as Ball).body.setVelocity(gameOptions.ballSpeed * Math.cos(this.direction), gameOptions.ballSpeed * Math.sin(this.direction));
            }
          });
        })
      }

      // we don't have a legal angle of fire
      else {

        // let's wait for player input again
        this.gameState = WAITING_FOR_PLAYER_INPUT;
      }
    }
  }

  // method to check collision between a ball and the bounds
  checkBoundCollision(ball, up, down, left, right) {

    // we only want to check lower bound and only if balls are running
    if (down && this.gameState == BALLS_ARE_RUNNING) {

      // stop the ball
      ball.setVelocity(0);

      // increase the amount of landed balls
      this.landedBalls++;

      // if this is the first landed ball...
      if (this.landedBalls == 1) {

        // save the ball in firstBallToLand variable
        this.firstBallToLand = ball;
      }
    }
  }

  // method to be executed at each frame
  update() {

    // if Arcade physics is updating or balls are running and all balls have landed...
    if ((this.gameState == ARCADE_PHYSICS_IS_UPDATING) || this.gameState == BALLS_ARE_RUNNING && this.landedBalls == this.ballGroup.getChildren().length) {

      // if the game state is still set to BALLS_ARE_RUNNING...
      if (this.gameState == BALLS_ARE_RUNNING) {

        // ... basically wait a frame to let Arcade physics update body positions
        this.gameState = ARCADE_PHYSICS_IS_UPDATING;
      }

      // if Arcade already updated body positions...
      else {

        // time to prepare for next move
        this.gameState = PREPARING_FOR_NEXT_MOVE;

        // move the blocks
        this.moveBlocks();

        // move the balls
        this.moveBalls();

        // move the extra balls
        this.moveExtraBalls();
      }
    }

    // if balls are running...
    if (this.gameState == BALLS_ARE_RUNNING) {

      // handle collisions between balls and blocks
      this.handleBallVsBlock();

      // handle collisions between ball and extra balls
      this.handleBallVsExtra();
    }
  }

  // method to move all blocks down a row
  moveBlocks() {

    // we will move blocks with a tween
    this.tweens.add({

      // we set all blocks as tween target
      targets: this.blockGroup.getChildren(),

      // which properties are we going to tween?
      props: {

        // y property
        y: {

          // each block is moved down from its position by its display height
          getEnd: function (target) {
            return target.y + target.displayHeight;
          }
        },
      },

      // scope of callback function
      callbackScope: this,

      // each time the tween updates...
      onUpdate: function (tween, target) {

        // tween down the value text too
        target.text.y = target.y;
      },

      // once the tween completes...
      onComplete: () => {

        // wait for player input again
        this.gameState = WAITING_FOR_PLAYER_INPUT;

        // execute an action on all blocks
        Phaser.Actions.Call(this.blockGroup.getChildren(), (block: any) => {

          // update row custom property
          block.row++;

          // if a block reached the bottom of the game area...
          if (block.row == gameOptions.blockLines) {

            // ... it's game over
            this.gameOver = true;
          }
        }, this);

        // if it's not game over...
        if (!this.gameOver) {

          // add another block line
          this.addBlockLine();
        }

        // if it's game over...
        else {

          // ...restart the game
          this.scene.start("PlayGame");
        }
      },

      // tween duration, 1/2 second
      duration: 500,

      // tween easing
      ease: "Cubic.easeInOut"
    });
  }

  // method to move all balls to first landed ball position
  moveBalls() {

    // we will move balls with a tween
    this.tweens.add({

      // we set all balls as tween target
      targets: this.ballGroup.getChildren(),

      // set x to match the horizontal position of the first landed ball
      x: this.firstBallToLand.gameObject.x,

      // tween duration, 1/2 second
      duration: 500,

      // tween easing
      ease: "Cubic.easeInOut"
    });
  }

  // method to move all extra balls
  moveExtraBalls() {

    // execute an action on all extra balls
    Phaser.Actions.Call(this.extraBallGroup.getChildren(), (ball: any) => {

      // if a ball reached the bottom of the game field...
      if (ball.row == gameOptions.blockLines) {

        // set it as "collected"
        ball.collected = true;
      }
    }, this)

    // we will move balls with a tween
    this.tweens.add({

      // we set all extra balls as tween target
      targets: this.extraBallGroup.getChildren(),

      // which properties are we going to tween?
      props: {

        // x property
        x: {

          getEnd: function (target) {

            // is the ball marked as collected?
            if (target.collected) {

              // set x to match the horizontal position of the first landed ball
              return target.scene.firstBallToLand.gameObject.x;
            }

            // ... or leave it in its place
            return target.x;
          }
        },

        // same thing with y position
        y: {
          getEnd: function (target) {
            if (target.collected) {
              return target.scene.firstBallToLand.gameObject.y;
            }
            return target.y + target.scene.blockSize;
          }
        },
      },

      // scope of callback function
      callbackScope: this,

      // once the tween completes...
      onComplete: () => {

        // execute an action on all extra balls
        Phaser.Actions.Call(this.extraBallGroup.getChildren(), (ball: any) => {

          // if the ball is not collected...
          if (!ball.collected) {

            // ... increase its row property
            ball.row++;
          }

          // if the ball has been collected...
          else {

            // remove the ball from extra ball group
            this.extraBallGroup.remove(ball);

            // add the ball to ball group
            this.ballGroup.add(ball);

            // set extra ball properties
            ball.body.collideWorldBounds = true;
            ball.body.onWorldBounds = true;
            ball.body.setBounce(1, 1);
          }
        }, this);
      },

      // tween duration, 1/2 second
      duration: 500,

      // tween easing
      ease: "Cubic.easeInOut"
    });
  }

  // method to handle collision between a ball and a block
  handleBallVsBlock() {

    // check collision between ballGroup and blockGroup members
    this.physics.world.collide(this.ballGroup, this.blockGroup, (ball, block) => {
      const _block = block as Block
      // decrease block value
      _block.value--;

      // if block value reaches zero...
      if (_block.value == 0) {

        // push block into recycledBlocks array
        this.recycledBlocks.push(block);

        // remove the block from blockGroup
        this.blockGroup.remove(block);

        // hide the block
        _block.visible = false;

        // hide block text
        _block.text.visible = false;
      }

      // if block value does not reach zero...
      else {

        // update block text
        _block.text.setText(_block.value.toString());
      }
    }, undefined, this);
  }

  // method to handle collision between a ball and an extra ball
  handleBallVsExtra() {

    // check overlap between ballGroup and extraBallGroup members
    this.physics.world.overlap(this.ballGroup, this.extraBallGroup, (ball, extraBall) => {
      const _extraBall = extraBall as Ball

      // set extra ball as collected
      _extraBall.collected = true;

      // add a tween to move the ball down
      this.tweens.add({

        // the target is the extra ball
        targets: _extraBall,

        // y destination position is the very bottom of game area
        y: game.config.height - this.bottomPanel.displayHeight - _extraBall.displayHeight / 2,

        // tween duration, 0.2 seconds
        duration: 200,

        // tween easing
        ease: "Cubic.easeOut"
      });
    }, undefined, this);
  }
}
