const main_video = document.querySelector('.main-video iframe');
const main_video_title = document.querySelector('.main-video .title');
const video_playlist = document.querySelector('.video-playlist .videos');

let data = [
    {
        'id': 'a1',
        'title': 'Learn How to Solve a Rubiks Cube in 10 Minutes',
        'name': 'https://www.youtube.com/embed/7Ron6MN45LY?list=PLI24ciRbl8BUHEeOBaLXY4GpaVXSULYp4',
        'duration': '10:03',
    },
    {
        'id': 'a2',
        'title': `Rubik's Cube: Your Journey to Becoming a pro.`,
        'name': `https://www.youtube.com/embed/MS5jByTX_pk`,
        'duration': '10:02',
    },
    {
        'id': 'a3',
        'title': '7 Tips For An Efficient Cross Every Solve',
        'name': 'https://www.youtube.com/embed/IWXpkfwimo0?list=PLI24ciRbl8BUHEeOBaLXY4GpaVXSULYp4',
        'duration': '10:00',
    },

    {
        'id': 'a4',
        'title': `Rubik's Cube: Advanced Cross Tutorial`,
        'name': 'https://www.youtube.com/embed/x93VB_v5ATM?list=PLI24ciRbl8BUHEeOBaLXY4GpaVXSULYp4',
        'duration': '10:09',
    },
    {
        'id': 'a5',
        'title': 'All 21 PLL Algorithms & Finger Tricks',
        'name': 'https://www.youtube.com/embed/9r_HqG4zSbk?list=PLI24ciRbl8BUHEeOBaLXY4GpaVXSULYp4',
        'duration': '8:02',
    },
    {
        'id': 'a6',
        'title': 'All 57 OLL Algorithms & Finger Tricks',
        'name': 'https://www.youtube.com/embed/vU6HsK3hvQs?list=PLI24ciRbl8BUHEeOBaLXY4GpaVXSULYp4',
        'duration': '13:06',
    },
    {
        'id': 'a7',
        'title': 'Top 10 Most Common Speed Cubing Mistakes',
        'name': 'https://www.youtube.com/embed/1JHvzmTIwBw?list=PLI24ciRbl8BUHEeOBaLXY4GpaVXSULYp4',
        'duration': '8:50',
    },

    {
        'id': 'a8',
        'title': `10 Rubik's Cube Tips Every Beginner Should Know`,
        'name': 'https://www.youtube.com/embed/RM0m5Kw_F48?list=PLI24ciRbl8BUHEeOBaLXY4GpaVXSULYp4',
        'duration': '10:38',
    },

];

data.forEach((video, i) => {
    let video_element = `
                <div class="video" data-id="${video.id}">
                    <img src="../svg/play.svg" alt="">
                    <p>${i + 1 > 9 ? i + 1 : '0' + (i + 1)}. </p>
                    <h3 class="title">${video.title}</h3>
                    <p class="time">${video.duration}</p>
                </div>
    `;
    video_playlist.innerHTML += video_element;
})

let videos = document.querySelectorAll('.video');
videos[0].classList.add('active');
videos[0].querySelector('img').src = '../svg/pause.svg';

videos.forEach(selected_video => {
    selected_video.onclick = () => {

        for (all_videos of videos) {
            all_videos.classList.remove('active');
            all_videos.querySelector('img').src = '../svg/play.svg';

        }

        selected_video.classList.add('active');
        selected_video.querySelector('img').src = '../svg/pause.svg';

        let match_video = data.find(video => video.id == selected_video.dataset.id);
        main_video.src = '' + match_video.name;
        main_video_title.innerHTML = match_video.title;
    }
});