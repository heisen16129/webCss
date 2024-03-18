// 加载轮播图的图片
const li = document.querySelectorAll('.box ul li');
for (let i = 0; i < li.length; i++) {
  li[i].style.background = `url(./images/GirlFriend0${i + 1}.jpg) no-repeat center/cover`;
}

const ul = document.querySelector('.box ul');

// 跳转函数
function MoveImg(num) {
  ul.style.transition = 'all 0.8s';
  ul.style.transform = `translateX(${-num * li[0].offsetWidth}px)`;
}

const li_clone = li[0].cloneNode(true);
ul.appendChild(li_clone);

const prev = document.querySelector('.box .prev');
const next = document.querySelector('.box .next');

let num = 0;

// 移动到下一张
function nextImg(num) {
  num++;
  if (num > li.length) {
    num = 1;
    ul.style.transition = 'none';
    ul.style.transform = `translateX(0px)`;
    li[0].offsetWidth;//强制渲染
  }
  MoveImg(num);
  return num;
}

// 左按钮设置
next.addEventListener('click', function () {
  num = nextImg(num);
});

// 右按钮设置
prev.addEventListener('click', function () {
  num--;
  if (num < 0) {
    ul.style.transition = 'none';
    ul.style.transform = `translateX(${-li.length * li[0].offsetWidth}px)`;
    li[0].offsetWidth;
    num = li.length - 1;
  }
  MoveImg(num);
});

// 设置定时器
let TimeNum;
TimeNum = setInterval(function () {
  num = nextImg(num);
}, 2000);

// 设置鼠标移入移出事件
const box = document.querySelector('.box');

box.addEventListener('mouseenter', function () {
  prev.style.display = 'block';
  next.style.display = 'block';
  clearInterval(TimeNum);
});

box.addEventListener('mouseleave', function () {
  prev.style.display = 'none';
  next.style.display = 'none';
  clearInterval(TimeNum);
  TimeNum = setInterval(function () {
    num = nextImg(num);
  }, 2000);
});


// 瀑布流布局

// 相关信息
const waterfall = document.querySelector('.waterfall');
const imgWidth = 220;

let mvName = "zcy";

// 创建元素
async function creatImg(name, format = '.webp') {

  let info = getinfo();

  let colum = info.column;


  // let cDiv = Math.floor(i / colum );
  // 先清空原有图片
  waterfall.innerHTML = '';

  for (let i = 0; i < colum; i++) {
    const cDiv = document.createElement('div');
    cDiv.classList.add('cDiv');
    waterfall.appendChild(cDiv);
  }

  let nextTop = new Array(colum);
  nextTop.fill(0);

  for (let i = 1; i <= 36; i++) {

    const img = document.createElement('img');
    img.src = `./images/${name}/${(10000 + i) + format}`;


    await new Promise((resolve) => {
      img.onload = () => {
        let minTop = getMinTop(nextTop);
        // console.log(minTop);
        const cDiv = document.querySelector(`.cDiv:nth-child(${minTop.index + 1})`);
        const div = document.createElement('div');
        div.classList.add('waterfallBox');
        div.appendChild(img);
        cDiv.appendChild(div);
        
         nextTop[minTop.index] = nextTop[minTop.index] + img.offsetHeight;
        resolve();
      };
    });

    // 在onload 函数中拿 img 真实的高度
    // img.onload = () => {

    //   let minTop = getMinTop(nextTop);
    //   // console.log(minTop);
    //   const cDiv = document.querySelector(`.cDiv:nth-child(${minTop.index + 1})`);
    //   const div = document.createElement('div');
    //   div.classList.add('waterfallBox');
    //   div.appendChild(img);
    //   cDiv.appendChild(div);
      
    //    nextTop[minTop.index] = nextTop[minTop.index] + img.offsetHeight;
    // };



  }
}

creatImg(mvName);
// window.addEventListener('load', layout);
window.addEventListener('resize', layout);
// 点击事件：冒泡
const nav = document.querySelector('.nav ul');
nav.addEventListener('click', function (e) {
  if (e.target.tagName === 'LI') {
    let n = +e.target.dataset.id;
    // 选中的下划线样式
    document.querySelector('.nav ul li.active').classList.remove('active');
    document.querySelector(`.nav ul li:nth-child(${n})`).classList.add('active');
    let name = e.target.dataset.name;
    if (name === 'xl') {
      mvName = "xl"
      creatImg(mvName, '.jpg');
    }
    else if (name === 'zcy') {
      mvName = "zcy"
      creatImg(mvName);
    }
  }
});


function getinfo() {
  //元素的布局宽度
  let waterfallWidth = waterfall.offsetWidth - 10;
  // 有几列
  let column = Math.floor(waterfallWidth / imgWidth);
  let gapCount = column - 1;
  let freeSpace = waterfallWidth - imgWidth * column;
  let gap = freeSpace / gapCount;
  return {
    gap: gap,
    column: column,
  };
}


function getMinTop(nextTop) {

  let min = nextTop[0], index = 0;
  for (let i = 0; i < nextTop.length; i++) {
    if (nextTop[i] < min) {
      min = nextTop[i];
      index = i;
    }
  }
  return {
    min: min,
    index: index,
  };
}


// 布局
function layout() {

  let format =  ".webp";
  // creatImg('zcy');
  let info = getinfo();
  if (info.column != waterfall.children.length) {
    if (mvName === 'xl') {
       format = ".jpg";
    }
    creatImg(mvName , format);
  }


}