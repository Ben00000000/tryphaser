var config = {
    type: Phaser.AUTO,
    width: 800, // Set a default width
    height: 600,
    scale: {
        mode: Phaser.Scale.RESIZE, // Scale the canvas to fit the screen size
        parent: 'phaser-example', // Replace with the ID of your HTML element
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursors;


var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'sky.png');
    this.load.spritesheet('dude', 'dude.png', { frameWidth: 113, frameHeight: 138 });
    this.load.image('ground', 'ground.png');
}

function create() {
   // Add background image
     let bg = this.add.image(0, 0, 'sky').setOrigin(0, 0).setScale(6);

 // Set camera bounds based on the whole world
    this.physics.world.setBounds(0, 0, bg.displayWidth * bg.scaleX, bg.displayHeight * bg.scaleY);

    // Adjust camera bounds to follow the player within the world size
    this.cameras.main.setBounds(0, 0, bg.displayWidth * bg.scaleX, bg.displayHeight * bg.scaleY);

  let wall = this.physics.add.staticSprite(3050, 5, 'ground').setOrigin(0, 0).setScale(6, 1).refreshBody();

    // Set physics world bounds to include the wall
    this.physics.world.setBounds(0, 0, 2000 + bg.displayWidth * bg.scaleX, bg.displayHeight * bg.scaleY);

  // Create ground
    let ground = this.physics.add.staticGroup();
    ground.create(0, 700, 'ground').setOrigin(0, 0).setScale(6, 1).refreshBody();

     // Set up player
     player = this.physics.add.sprite(100, 450, 'dude');
     player.setBounce(0.2);
     player.setCollideWorldBounds(true);



    // Create player animations
       this.anims.create({
           key: 'left',
           frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 2 }),  // Adjust end frame based on the number of frames in your sprite
           frameRate: 10,
           repeat: -1
       });

       this.anims.create({
           key: 'turn',
           frames: [{ key: 'dude', frame: 1 }],  // Adjust frame based on the number of frames in your sprite
           frameRate: 20
       });

       this.anims.create({
           key: 'right',
           frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 2 }),  // Adjust start and end frames based on the number of frames in your sprite
           frameRate: 10,
           repeat: -1
       });

    // Follow the player with the camera
    this.cameras.main.startFollow(player, true, 0.5, 0.5);

    // Create cursor keys
    cursors = this.input.keyboard.createCursorKeys();
        // Add collision between the player and the ground
        this.physics.add.collider(player, [ground, wall]);


    // Create on-screen buttons
      leftButton = this.add.sprite(50, 600, 'leftButton').setInteractive();
      rightButton = this.add.sprite(150, 600, 'rightButton').setInteractive();
      jumpButton = this.add.sprite(700, 600, 'jumpButton').setInteractive();

      // Scale the buttons as needed
      leftButton.setScale(2);
      rightButton.setScale(2);
      jumpButton.setScale(2);

      leftButton.setAlpha(0.5);
      rightButton.setAlpha(0.5);
      jumpButton.setAlpha(0.5);


      // Add button events
      leftButton.on('pointerdown', function () {
          cursors.left.isDown = true;
      });

      leftButton.on('pointerup', function () {
          cursors.left.isDown = false;
      });

      rightButton.on('pointerdown', function () {
          cursors.right.isDown = true;
      });

      rightButton.on('pointerup', function () {
          cursors.right.isDown = false;
      });

      jumpButton.on('pointerdown', function () {
          if (player.body.onFloor()) {
              player.setVelocityY(-300);
          }
      });
  }

  function update() {
      // Update the position of the on-screen buttons with the camera
      leftButton.x = 50 + this.cameras.main.scrollX;
      rightButton.x = 150 + this.cameras.main.scrollX;
      jumpButton.x = 650 + this.cameras.main.scrollX;

      // Player movement code
      if (cursors.left.isDown) {
          player.setVelocityX(-160);
          player.flipX = true;
          player.anims.play('left', true);
      } else if (cursors.right.isDown) {
          player.setVelocityX(160);
          player.flipX = false;
          player.anims.play('right', true);
      } else {
          player.setVelocityX(0);
          player.anims.play('turn');
      }

      // Check for the jump key
      if (cursors.up.isDown && player.body.onFloor()) {
          player.setVelocityY(-300);  // Adjust the jump velocity as needed
      }
  }
