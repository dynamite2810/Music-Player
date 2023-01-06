const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "TAN";

const player = $(".player");
const cd = $(".cd");

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const volumeBar = $(".volume-progress");
const volumeBtn = $(".btn-volume");
const option = $(".option i");
const optionList = $(".option-list");

const app = {
    currentIndex: 0,
    currentVolume: 1,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
          name: "Photograph",
          singer: "Ed Sheeran",
          path:
            "./music/Photograph.mp3",
          image: "http://static.ybox.vn/2017/11/13/e32c02e8-c821-11e7-ac5b-2e995a9a3302.jpg"
        },
        {
            name: "để tôi ôm em bằng giai điệu này",
            singer: "Kai Đinh x MIN x Grey D",
            path:
              "./music/Để tôi ôm em bằng giai điệu này.mp3",
            image: "https://i.ytimg.com/vi/XmTLFtbv0Oo/maxresdefault.jpg"
        },
        {
          name: "Đã lỡ yêu em nhiều",
          singer: "Justatee",
          path: "./music/Đã lỡ yêu em nhiều.mp3",
          image:
            "https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/covers/d/a/dae7488899bf6ee55f4127cb6a889391_1510557125.jpg"
        },
        {
        name: "Nevada",
        singer: "Vicetone",
        path: './music/Nevada.mp3',
        image: "https://avatar-ex-swe.nixcdn.com/song/2018/06/19/7/b/9/3/1529382807600_640.jpg"
      },
      {
        name: "Wake me up",
        singer: "Avicii",
        path: "./music/Wake Me Up.mp3",
        image:
          "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiGVVvZQsgSzZg4jIkb0EY4WPb7szSrgPUGbL5gghxqWRvy06Sum37AIaMEmv5oI01YFgp-aXW5r-p6jDXW_9SY5HHOayb4wd4FWEJl-HY2z7vBX7MqLkCcf8VI-Uh7ZWr0Oks6WrztG80bMuTRBJd6koWyOvqyQnoh_3OaG2Ewe5p4YhImdLM7YGzA/w680/1.jpg"
      },
      {
        name: "Bước qua nhau",
        singer: "Vũ",
        path: "./music/Bước qua nhau.mp3",
        image:
          "https://avatar-ex-swe.nixcdn.com/song/share/2021/11/19/b/e/5/0/1637317185220.jpg"
      },
      {
        name: "Sugar",
        singer: "Maroon 5",
        path:
          "./music/Sugar.mp3",
        image:
          "https://avatar-nct.nixcdn.com/song/2018/06/22/0/c/c/b/1529655970762_640.jpg"
      },
      {
        name: "Ngày mai em đi",
        singer: "Touliver x Lê Hiếu x Soobin Hoàng Sơn",
        path: "./music/Ngày mai em đi.mp3",
        image:
          "https://avatar-ex-swe.nixcdn.com/song/2017/08/07/c/b/1/e/1502073702719_640.jpg"
      }
    ],
    
    // Hàm render 
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div 
                        class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                        <ul class="option-list">
                            <li class="option-delete"> Xoá </li>
                            <li class="option-report"> Báo lỗi </li> 
                        </ul>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    // Định nghĩa thuộc tính cho object
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
        
    },
    // Xử lý sự kiện DOM events
    handleEvents: function() {
        // Xử lý CD thumb quay/ dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 17000, // 20000ms
            iterations: Infinity
        })

        cdThumbAnimate.pause();

        // Xử lý thu nhỏ CD
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi nhấn play/pause
        playBtn.onclick = () => {
            if(this.isPlaying){
                audio.pause();
            } else {
                audio.play();
            }
        }
        // Khi bài hát đang chạy
        audio.onplay = () => {
            this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }
        // Khi bài hát đang dừng
        audio.onpause = () => {
            this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        }
        // Cập nhật thanh thời gian bài hát
        audio.ontimeupdate = () => {
            if(audio.duration) {
                const progressPercent = audio.currentTime / audio.duration * 100;
                progress.value = progressPercent;
            }
        }
        // Tua bài hát
        progress.onchange = (e) => {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        // Next
        nextBtn.onclick = () => {
            if(this.isRandom) {
                this.randomSong();
            } else {
                this.nextSong();
            }
            audio.play();
            this.render();
            this.scrollToActiveSong();
        }
        // Previous
        prevBtn.onclick = () => {
            if(this.isRandom) {
                this.randomSong();
            }
            else {
                this.prevSong();
            }
            audio.play();
            this.render();
            this.scrollToActiveSong();
        }
        // Random song
        randomBtn.onclick = () => {
            this.isRandom = !this.isRandom;
            this.setConfig('isRandom', this.isRandom);
            randomBtn.classList.toggle('active', this.isRandom);

        }
        // Repeat song
        repeatBtn.onclick = () => {
            this.isRepeat = !this.isRepeat;
            this.setConfig('isRepeat', this.isRepeat);
            repeatBtn.classList.toggle('active', this.isRepeat);
            
        }
        // Khi bài hát kết thúc, nếu đang bật repeat thì nghe lại bài đó, không thì sẽ next (nếu random thì next random)
        audio.onended = () => {
            if(this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.click();
            }
        }

        playlist.onclick = (e) => {
            const songNode = e.target.closest('.song:not(.active)');

            if(songNode || e.target.closest('.option')) {
                
                if(songNode) {
                    this.currentIndex = Number(songNode.dataset.index);
                    this.loadCurrentSong();
                    audio.play();
                    this.render();
                }
            }
        }

        volumeBar.onclick = (e) => {
            currentVolume = e.target.value/100;
            audio.volume = currentVolume;
            if(audio.volume === 0 && !volumeBtn.classList.contains('mute')) volumeBtn.classList.add('mute');
            else volumeBtn.classList.remove('mute');
        }

        volumeBtn.onclick = () => {
            if(audio.volume) {
                audio.volume = 0;
                volumeBtn.classList.add('mute');
            } else {
                if(typeof currentVolume === 'undefined'|| currentVolume === 0){
                    audio.volume = 1;
                }
                else {
                    audio.volume = currentVolume;
                }
                volumeBtn.classList.remove('mute');
            }
            volumeBar.value = audio.volume * 100;
            console.log(audio.volume);
        }

        // option.onclick = () => {
        //     optionList.classList.toggle('appear');
        // }
        
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }, 200)
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name + ' - ' + this.currentSong.singer;
        document.title = heading.textContent;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.currentSong = this.config.currentSong;
        
    },

    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
           this.currentIndex = 0; 
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    // Khởi chạy
    start: function() {

        this.loadConfig();

        this.defineProperties();

        this.handleEvents();

        this.loadCurrentSong();

        this.render();

        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
    
}
app.start();
