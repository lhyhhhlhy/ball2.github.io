// 定义弹球计数变量

const para = document.querySelector('p');
let count = 0;

// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数

function random(min,max) {
  const num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// 生成随机颜色值的函数

function randomColor() {
  const color = 'rgb(' +
                random(0, 255) + ',' +
                random(0, 255) + ',' +
                random(0, 255) + ')';
  return color;
}

// 定义 Shape 构造器
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}
// Ball 构造器，继承自 Shape
function Ball(x, y, velX, velY, exists, color, size) {

  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}

//Ball的原型继承自Shape的原型
Ball.prototype = Object.create(Shape.prototype);
//确保Ball原型对象的constructor属性正确地指向Ball构造函数
Ball.prototype.constructor = Ball;

// 定义彩球绘制函数

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// 定义彩球更新函数

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// 定义碰撞检测函数

Ball.prototype.collisionDetect = function() {
  for(var j = 0; j < balls.length; j++) {
    if(this !== balls[j]) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size && balls[j].exists) {
        balls[j].color = this.color = randomColor();
      }
    }
  }
};

// 定义 EvilCircle 构造器, 继承自 Shape
function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);

  this.color = 'white';
  this.size = 10;
}

//原型链
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;


// 定义 EvilCircle 绘制方法

EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
   // 绘制一个圆，参数分别为圆心横纵坐标，圆的半径(this.size)
   //起始角度(0)，结束角度(2 * Math.PI)
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};


// 定义 EvilCircle 的边缘检测（checkBounds）方法
EvilCircle.prototype.checkBounds = function() {
  // 如果超出，将圆的坐标减去圆的半径，使圆移动到画布内
  if((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if((this.y - this.size) <= 0) {
    this.y += this.size;
  }
};

// 定义 EvilCircle 控制设置（setControls）方法

EvilCircle.prototype.setControls = function() {
  // 当键盘被按下时，执行以下函数
  window.onkeydown = e => {
    switch(e.key) {
      case 'a':
      case 'A':
      case 'ArrowLeft':
        this.x -= this.velX;
        break;
      case 'd':
      case 'D':
      case 'ArrowRight':
        this.x += this.velX;
        break;
      case 'w':
      case 'W':
      case 'ArrowUp':
        this.y -= this.velY;
        break;
      case 's':
      case 'S':
      case 'ArrowDown':
        this.y += this.velY;
        break;
    }
  };
};

// 定义 EvilCircle 冲突检测函数

EvilCircle.prototype.collisionDetect = function() {
  // 遍历彩球数组中的每一个彩球
  for(let j = 0; j < balls.length; j++) {
    // 计算当前EvilCircle对象与彩球之间的距离差
    if( balls[j].exists ) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        // 设置彩球的存在状态为false，即彩球被销毁
        balls[j].exists = false;
        // 减少剩余彩球的数量
        count--;
        // 更新页面上显示剩余彩球数量的文本内容
        para.textContent = '剩余彩球数：' + count;
      }
    }
  }
};


// 定义一个数组，生成并保存所有的球，

const balls = [];

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    randomColor(),
    size
  );
  balls.push(ball);
  count++;
  para.textContent = '剩余彩球数：' + count;
}

// 定义一个循环来不停地播放

let evil = new EvilCircle(random(0, width), random(0, height), true);
evil.setControls();

const backgroundImage = new Image();
backgroundImage.src = 'beijing.jpg'; 

function loop() {
  ctx.drawImage(backgroundImage, 0, 0, width, height);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, 0, width, height);

  for(let i = 0; i < balls.length; i++) {
    if(balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }

  }


  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();

  requestAnimationFrame(loop);
}
backgroundImage.onload = function() {
  loop();
};

//loop();